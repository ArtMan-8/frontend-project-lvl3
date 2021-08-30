import axios from 'axios';
import _ from 'lodash';
import {
  message,
  formProcessState,
  PROXY_URL,
  FETCHING_TIMEOUT,
} from './constants';

export function getRss(url) {
  return axios
    .get(`${PROXY_URL}/get`, {
      params: { url, disableCache: true },
    })
    .then(({ data }) => data.contents);
}

export function parseRssData(rss) {
  const parser = new DOMParser();
  const parseData = parser.parseFromString(rss, 'application/xml');

  if (parseData.getElementsByTagName('parsererror').length) {
    return { isError: true };
  }

  const feed = {
    title: parseData.querySelector('title').textContent,
    description: parseData.querySelector('description').textContent,
  };

  const posts = [...parseData.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { feed, posts };
}

export function normalizeRssData(parsedData) {
  const feedId = _.uniqueId();

  const feed = {
    ...parsedData.feed,
    id: feedId,
  };

  const posts = parsedData.posts.map((item) => ({
    ...item,
    id: _.uniqueId(),
    feedId,
  }));

  return { feed, posts };
}

export function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = formProcessState.SENDING;

  return getRss(rssUrl)
    .then((contents) => {
      const rawData = parseRssData(contents);

      if (rawData.isError) {
        watchedState.rssForm.error = message.INVALID_RSS;
        return;
      }

      const normalizedData = normalizeRssData(rawData);

      watchedState.posts.unshift(...normalizedData.posts);
      watchedState.feeds.unshift({ url: rssUrl, ...normalizedData.feed });
      watchedState.rssForm.error = null;
    })
    .catch(() => {
      watchedState.rssForm.error = message.NETWORK_ERROR;
    })
    .finally(() => {
      watchedState.rssForm.processState = formProcessState.FINISHED;
    });
}

export function postsRefetch(watchedState, delay = FETCHING_TIMEOUT) {
  const requests = watchedState.feeds.map((feed) => getRss(feed.url).then((contents) => {
    const rawData = parseRssData(contents);
    const normalizedData = normalizeRssData(rawData);

    const posts = watchedState.posts.filter(
      ({ feedId }) => feedId === feed.id,
    );

    const newPosts = _.differenceBy(normalizedData.posts, posts, 'title');
    watchedState.posts.unshift(...newPosts);
  }));

  Promise.all(requests).finally(() => {
    setTimeout(() => postsRefetch(watchedState), delay);
  });
}
