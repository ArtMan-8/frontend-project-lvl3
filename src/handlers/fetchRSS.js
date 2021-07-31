import axios from 'axios';
import { message, formProcessState, PROXY_URL } from '../constants';
import parseRssData from './parseRssData';

const isValidRss = (rssData) => rssData.indexOf('xml version') !== -1;

export const getRss = (url) => axios
  .get(`${PROXY_URL}/get`, {
    params: { url, disableCache: true },
  })
  .then(({ data }) => data.contents);

export default function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = formProcessState.SENDING;

  return getRss(rssUrl)
    .then((contents) => {
      if (isValidRss(contents)) {
        const rawData = parseRssData(contents);

        watchedState.posts.unshift(...rawData.posts);
        watchedState.feeds.unshift({ url: rssUrl, ...rawData.feed });
        watchedState.rssForm.error = null;
      } else {
        watchedState.rssForm.error = message.NOT_RSS;
      }

      watchedState.rssForm.processState = formProcessState.FINISHED;
    })
    .catch(() => {
      watchedState.rssForm.error = message.NETWORK_ERROR;
      watchedState.rssForm.processState = formProcessState.FAILED;
    });
}
