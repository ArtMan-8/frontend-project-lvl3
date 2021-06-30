import { Feedback } from '../const';

export default function renderMessage(
  containers,
  i18nextInstance,
  watchedState,
) {
  const { feedbackMessage } = containers;

  const isSUccessMessage = () => (watchedState.message === Feedback.SUCCESS_FETCH
    ? 'm-2 mt-0 position-absolute small text-info'
    : 'm-2 mt-0 position-absolute small text-warning');

  feedbackMessage.setAttribute('class', `${isSUccessMessage()}`);

  feedbackMessage.textContent = watchedState.message
    && i18nextInstance.t(`form.feedback.${watchedState.message}`);
}
