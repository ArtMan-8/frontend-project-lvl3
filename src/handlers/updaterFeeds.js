import _ from 'lodash';
import parseRssData from './parseRssData';
import { DELAY_UPDATE } from '../constants';
import { getRss } from './fetchRSS';

function updaterFeeds(watchedState) {
  const requests = watchedState.feeds.map((feed) => getRss(feed.url).then((contents) => {
    const rawData = parseRssData(contents);
    const posts = watchedState.posts.filter(
      ({ feedId }) => feedId === feed.id,
    );

    const newPosts = _.differenceBy(rawData.posts, posts, 'title');
    watchedState.posts.unshift(...newPosts);
  }));

  return Promise.all(requests);
}

export default function postsRefetch(watchedState, delay = DELAY_UPDATE) {
  updaterFeeds(watchedState).finally(() => {
    setTimeout(() => postsRefetch(watchedState), delay);
  });
}
