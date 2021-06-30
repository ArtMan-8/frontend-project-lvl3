import axios from 'axios';
import { Feedback, FormProcessState } from '../const';

const proxiedRequest = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;

export const getRssData = (rss) => {
  const parser = new DOMParser();
  const parseData = parser.parseFromString(rss, 'application/xml');

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
};

export const isValidRss = (rssData) => rssData.indexOf('xml version') !== -1;

export default function fetchRSS(watchedState, rssUrl) {
  watchedState.rssForm.processState = FormProcessState.SENDING;

  return axios
    .get(proxiedRequest(rssUrl))
    .then(({ data }) => {
      if (isValidRss(data.contents)) {
        const rawData = getRssData(data.contents);

        watchedState.dataFeeds.push({
          url: rssUrl,
          ...rawData,
        });

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
