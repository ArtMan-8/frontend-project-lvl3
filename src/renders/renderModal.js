export default function renderModal(
  modalContainer,
  i18nextInstance,
  selectedPost,
) {
  const modalTitle = modalContainer.querySelector('.modal-title');
  const modalDescription = modalContainer.querySelector('.modal-body');
  const modalClose = modalContainer.querySelector('.btn-secondary');
  const modalContent = modalContainer.querySelector('.full-article');

  const { title, description, link } = selectedPost;

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalClose.textContent = i18nextInstance.t('buttons.close');
  modalContent.textContent = i18nextInstance.t('buttons.readAll');
  modalContent.setAttribute('href', link);
}
