import axios from 'axios';
import { FormProcessState } from '../watchers/processWatcher';

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
  return axios
    .get(proxiedRequest(rssUrl))
    .catch(() => {
      watchedState.message = 'networkError';
    })
    .then(({ data }) => {
      if (isValidRss(data.contents)) {
        const rawData = getRssData(data.contents);

        watchedState.dataFeeds.push({
          url: rssUrl,
          ...rawData,
        });
        watchedState.message = 'success';
        watchedState.rssForm.processState = FormProcessState.FINISHED;

        return rawData;
      }

      watchedState.message = 'errorRss';
      watchedState.rssForm.processState = FormProcessState.FINISHED;

      return null;
    })
    .catch(() => {
      watchedState.message = 'networkError';
      watchedState.rssForm.processState = FormProcessState.FAILED;
    });
}
