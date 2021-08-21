export default function renderModal(
  modalContainer,
  i18nextInstance,
  watchedState,
) {
  const {
    ui: { selectedPost },
    posts,
  } = watchedState;
  const { title, description, link } = posts.find(
    ({ id }) => id === selectedPost,
  );

  const modalTitle = modalContainer.querySelector('.modal-title');
  const modalDescription = modalContainer.querySelector('.modal-body');
  const modalClose = modalContainer.querySelector('.btn-secondary');
  const modalContent = modalContainer.querySelector('.full-article');

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalClose.textContent = i18nextInstance.t('buttons.close');
  modalContent.textContent = i18nextInstance.t('buttons.readAll');
  modalContent.setAttribute('href', link);
}
