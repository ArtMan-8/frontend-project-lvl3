import _ from 'lodash';
import parseRssData from './parseRssData';
import { DELAY_UPDATE } from '../constants';
import { getRss } from './fetchRSS';

function updaterFeeds(watchedState) {
  const requests = watchedState.feeds.map((feed) => getRss(feed.url).then((contents) => {
    const rawData = parseRssData(contents);
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
