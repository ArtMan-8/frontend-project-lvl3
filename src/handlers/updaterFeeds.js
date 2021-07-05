import _ from 'lodash';
import axios from 'axios';
import parseRssData from './parseRssData';
import { DELAY_UPDATE, PROXY_URL } from '../const';

function updaterFeeds(watchedState) {
  const requests = watchedState.feeds.map((feed) => axios
    .get(`${PROXY_URL}/get`, {
      params: { url: feed.url, disableCache: true },
    })
    .then(({ data }) => {
      const rawData = parseRssData(data.contents);
      const posts = watchedState.posts.get(feed.url);

      const newPosts = _.differenceBy(rawData.posts, posts, 'title');
      watchedState.posts.set(feed.url, posts.concat(newPosts));
    }));

  return Promise.all(requests);
}

export default function postsRefetch(watchedState) {
  updaterFeeds(watchedState)
    .then(() => {
      watchedState.updateDelay = DELAY_UPDATE;
      setTimeout(() => postsRefetch(watchedState), watchedState.updateDelay);
    })
    .catch(() => {
      watchedState.updateDelay *= 2;
      setTimeout(() => postsRefetch(watchedState), watchedState.updateDelay);
    });
}
