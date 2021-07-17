export default function renderMessage(isError) {
  return (feedbackMessage, i18nextInstance, watchedState) => {
    const { feedback } = watchedState;

    feedbackMessage.setAttribute(
      'class',
      `m-2 mt-0 position-absolute small text-${isError ? 'warning' : 'info'}`,
    );
    feedbackMessage.textContent = feedback && i18nextInstance.t(`feedback.${feedback}`);
  };
}
