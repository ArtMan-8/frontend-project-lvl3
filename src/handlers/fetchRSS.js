import axios from 'axios';
import { Feedback, FormProcessState, PROXY_URL } from '../const';
import parseRssData from './parseRssData';

const isValidRss = (rssData) => rssData.indexOf('xml version') !== -1;

export default function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = FormProcessState.SENDING;

  return axios
    .get(`${PROXY_URL}/get`, {
      params: { url: rssUrl, disableCache: true },
    })
    .then(({ data }) => {
      if (isValidRss(data.contents)) {
        const rawData = parseRssData(data.contents);

        watchedState.posts.set(rssUrl, rawData.posts);
        watchedState.feeds.push({ url: rssUrl, ...rawData.feed });

        watchedState.currentFeed = rssUrl;
        watchedState.message = Feedback.SUCCESS_FETCH;
      } else {
        watchedState.message = Feedback.NOT_RSS;
      }

      watchedState.rssForm.processState = FormProcessState.FINISHED;
    })
    .catch(() => {
      watchedState.message = Feedback.NETWORK_ERROR;
      watchedState.rssForm.processState = FormProcessState.FAILED;
    });
}
