import _ from 'lodash';
import axios from 'axios';
import parseRssData from './parseRssData';
import { DELAY_UPDATE, PROXY_URL } from '../constants';

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

export default function postsRefetch(watchedState, delay = DELAY_UPDATE) {
  updaterFeeds(watchedState)
    .then(() => {
      setTimeout(() => postsRefetch(watchedState), delay);
    })
    .catch(() => {
      setTimeout(() => postsRefetch(watchedState), delay * 2);
    });
}
