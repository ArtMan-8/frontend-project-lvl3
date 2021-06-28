import * as yup from 'yup';

const isValidUrl = (url) => {
  const schema = yup.string().required().url();
  return schema.isValid(url);
};

const isExistUrl = (data, url) => data.map((feed) => feed.url).includes(url);

export default function urlWatcher(watchedState, url) {
  isValidUrl(url.trim()).then((isValid) => {
    if (isValid) {
      if (!isExistUrl(watchedState.dataFeeds, url)) {
        watchedState.rssForm.isValid = true;
      } else {
        watchedState.rssForm.isValid = false;
        watchedState.message = 'isExist';
      }
    } else {
      watchedState.rssForm.isValid = false;
      watchedState.message = 'invalid';
    }
  });
}
