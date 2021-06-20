const handleLanguageSelect = (state) => (event) => {
  const { language } = event.target.dataset;
  state.language = language;
};

export default function render(containers, watchedState, i18nextInstance) {
  const {
    title,
    subTitle,
    languageSelect,
    formRss,
    formInput,
    formLabel,
    submitButton,
    exampleMessage,
    feedbackMessage,
    feedsContainer,
    postsContainer,
  } = containers;

  languageSelect.textContent = '';
  i18nextInstance.languages
    .sort()
    .forEach((language, index) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'radio');
      input.setAttribute('class', 'btn-check');
      input.setAttribute('name', 'btnradio');
      input.setAttribute('data-language', language);
      input.setAttribute('id', `btnradio${index}`);
      if (i18nextInstance.language === language) {
        input.setAttribute('checked', 'checked');
      }

      input.addEventListener('click', handleLanguageSelect(watchedState));

      const label = document.createElement('label');
      label.setAttribute('class', 'btn btn-outline-primary');
      label.setAttribute('for', `btnradio${index}`);
      label.textContent = language;

      languageSelect.append(input);
      languageSelect.append(label);
    });

  languageSelect.setAttribute(
    'aria-label',
    i18nextInstance.t('languageSelect'),
  );
  formInput.setAttribute('placeholder', i18nextInstance.t('form.placeholder'));
  formLabel.textContent = i18nextInstance.t('form.placeholder');
  title.textContent = i18nextInstance.t('title');
  subTitle.textContent = i18nextInstance.t('subTitle');
  submitButton.textContent = i18nextInstance.t('form.add');
  exampleMessage.textContent = i18nextInstance.t('form.example');
}
