export default function renderMessage(
  messageContainer,
  i18nextInstance,
  watchedState,
) {
  const { error } = watchedState.rssForm;

  messageContainer.setAttribute(
    'class',
    `m-2 mt-0 position-absolute small text-${error ? 'warning' : 'info'}`,
  );
  messageContainer.textContent = i18nextInstance.t(
    error ? `errors.${error}` : 'success',
  );
}
