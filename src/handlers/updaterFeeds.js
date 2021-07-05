import _ from 'lodash';
import axios from 'axios';
import parseRssData from './parseRssData';
import { proxiedRequest } from './fetchRSS';
import { DELAY_UPDATE } from '../const';

function updaterFeeds(watchedState) {
  const requests = watchedState.feeds.map((feed) => axios.get(proxiedRequest(feed.url)).then(({ data }) => {
    const rawData = parseRssData(data.contents);
    const posts = watchedState.posts.get(feed.url);

    const newPosts = _.differenceBy(rawData.posts, posts, 'title');
    watchedState.posts.set(feed.url, posts.concat(newPosts));
  }));

  return Promise.all(requests);
}

export default function postsRefetch(watchedState) {
  let updateTimer = setTimeout(function updatePosts() {
    updaterFeeds(watchedState)
      .then(() => {
        watchedState.updateDelay = DELAY_UPDATE;
        updateTimer = setTimeout(updatePosts, watchedState.updateDelay);
      })
      .catch(() => {
        watchedState.updateDelay *= 2;
        updateTimer = setTimeout(updatePosts, watchedState.updateDelay);
      });
  }, watchedState.updateDelay);
}
