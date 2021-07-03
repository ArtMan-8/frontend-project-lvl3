import _ from 'lodash';
import axios from 'axios';
import parseRssData from './parseRssData';
import { proxiedRequest } from './fetchRSS';

export default function updaterFeeds(watchedState) {
  const requests = watchedState.feeds.map((feed) => axios.get(proxiedRequest(feed.url)).then(({ data }) => {
    const rawData = parseRssData(data.contents);
    const posts = watchedState.posts.get(feed.url);

    const newPosts = _.differenceBy(rawData.posts, posts, 'title');

    watchedState.posts.set(feed.url, posts.concat(newPosts));
  }));

  return Promise.all(requests);
}
