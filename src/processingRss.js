import axios from 'axios';
import _ from 'lodash';
import {
  message,
  formProcessState,
  FETCHING_TIMEOUT,
  PROXY_URL,
} from './constants';

function addProxy(url) {
  return `${PROXY_URL}/get?url=${url}`;
}

function parseRssData(rss) {
  const parser = new DOMParser();
  const parseData = parser.parseFromString(rss, 'application/xml');

  if (parseData.getElementsByTagName('parsererror').length) {
    throw new Error(message.INVALID_RSS);
  }

  const title = parseData.querySelector('title').textContent;
  const description = parseData.querySelector('description').textContent;

  const items = [...parseData.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { title, description, items };
}

function normalizeRssData({ title, description, items }, oldFeedId = null) {
  const feedId = oldFeedId || _.uniqueId();

  const feed = {
    title,
    description,
    id: feedId,
  };

  const posts = items.map((item) => ({
    ...item,
    id: _.uniqueId(),
    feedId,
  }));

  return { feed, posts };
}

function getRss(url, feedId) {
  return axios
    .get(addProxy(url), {
      params: { disableCache: true },
    })
    .catch(() => {
      throw new Error(message.NETWORK_ERROR);
    })
    .then(({ data }) => parseRssData(data.contents))
    .catch((error) => {
      throw new Error(error.message);
    })
    .then((parsedData) => normalizeRssData(parsedData, feedId));
}

export function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = formProcessState.SENDING;

  return getRss(rssUrl, watchedState)
    .then((data) => {
      watchedState.posts.unshift(...data.posts);
      watchedState.feeds.unshift({ url: rssUrl, ...data.feed });

      watchedState.rssForm.error = null;
      watchedState.rssForm.processState = formProcessState.FINISHED;
    })
    .catch((error) => {
      watchedState.rssForm.error = error.message;
      watchedState.rssForm.processState = formProcessState.FAILED;
    })
    .finally(() => {
      watchedState.rssForm.processState = formProcessState.FILLING;
    });
}

export function postsRefetch(watchedState, delay = FETCHING_TIMEOUT) {
  const requests = watchedState.feeds.map((feed) => getRss(feed.url, feed.id).then((data) => {
    const posts = watchedState.posts.filter(
      ({ feedId }) => feedId === feed.id,
    );

    const newPosts = _.differenceBy(data.posts, posts, 'title');
    watchedState.posts.unshift(...newPosts);
  }));

  Promise.all(requests).finally(() => {
    setTimeout(() => postsRefetch(watchedState), delay);
  });
}
