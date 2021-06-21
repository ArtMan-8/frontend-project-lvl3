import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import renderUI from './render/renderUI';
import addHandlers from './handlers/addHandlers';
import resources from './locales';
import renderErrorMessage from './render/renderFeedbackMessage';

const DEFAULT_LANGUAGE = 'en';

const isValidUrl = url => {
  const schema = yup.string().required().url();
  return schema.isValid(url);
};

export default function app() {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: Object.keys(resources),
    resources,
  });

  const state = {
    language: DEFAULT_LANGUAGE,
    formRss: {
      url: '',
      valid: true,
      error: false,
      success: false,
    },
  };

  const containers = {
    title: document.querySelector('#title'),
    subTitle: document.querySelector('#subTitle'),
    languageSelect: document.querySelector('#languageSelect'),
    rssForm: document.querySelector('#rss'),
    formInput: document.querySelector('#rss input'),
    formLabel: document.querySelector('#rss label'),
    submitButton: document.querySelector('#rss button'),
    exampleMessage: document.querySelector('#example'),
    feedsContainer: document.querySelector('#feeds'),
    postsContainer: document.querySelector('#posts'),
  };

  const watchedState = onChange(state, (key, value) => {
    switch (key) {
      case 'language':
        i18nInstance
          .changeLanguage(value)
          .then(() => renderUI(containers, i18nInstance));
        break;
      case 'formRss.url':
        isValidUrl(value)
          .then(isValid => {
            watchedState.formRss.valid = isValid;

            if (!isValid) {
              throw new Error(i18nInstance.t('form.feedback.error'));
            }

            return value;
          })
          .then(url => console.log(url))
          .catch(error => renderErrorMessage(containers, error.message));
        break;
      default:
        break;
    }
  });

  renderUI(containers, i18nInstance);
  addHandlers(containers, watchedState);
}
