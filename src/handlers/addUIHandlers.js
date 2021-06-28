import { FormProcessState } from '../watchers/processWatcher';

export default function addUIHandlers(containers, watchedState) {
  const { rssForm, languageSelect } = containers;

  languageSelect.addEventListener('click', (event) => {
    if (event.target.nodeName === 'INPUT') {
      const { language } = event.target.dataset;
      watchedState.language = language;
    }
  });

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('rss');
    watchedState.rssForm.processState = FormProcessState.SENDING;
    watchedState.rssForm.url = url;
  });
}
