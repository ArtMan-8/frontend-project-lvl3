import axios from 'axios';
import { feedback, formProcessState, PROXY_URL } from '../constants';
import parseRssData from './parseRssData';

const isValidRss = (rssData) => rssData.indexOf('xml version') !== -1;

export default function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = formProcessState.SENDING;

  return axios
    .get(`${PROXY_URL}/get`, {
      params: { url: rssUrl, disableCache: true },
    })
    .then(({ data }) => {
      if (isValidRss(data.contents)) {
        const rawData = parseRssData(data.contents);

        watchedState.posts.unshift(...rawData.posts);
        watchedState.feeds.unshift({ url: rssUrl, ...rawData.feed });
        watchedState.rssForm.error = false;
        watchedState.feedback = feedback.SUCCESS_FETCH;
      } else {
        watchedState.rssForm.error = true;
        watchedState.feedback = feedback.NOT_RSS;
      }

      watchedState.rssForm.processState = formProcessState.FINISHED;
    })
    .catch(() => {
      watchedState.rssForm.error = true;
      watchedState.rssForm.processState = formProcessState.FAILED;
      watchedState.feedback = feedback.NETWORK_ERROR;
    });
}
