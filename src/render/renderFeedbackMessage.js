export default function renderErrorMessage(containers, message) {
  const { rssForm } = containers;

  let feedbackMessage = document.querySelector('#feedback');

  if (feedbackMessage) {
    feedbackMessage.remove();
  }

  feedbackMessage = document.createElement('p');
  feedbackMessage.setAttribute('id', 'feedback');
  feedbackMessage.setAttribute('class', 'm-2 mt-0 position-absolute small');

  feedbackMessage.classList.add('text-warning');

  feedbackMessage.textContent = message;
  rssForm.parentNode.append(feedbackMessage);
}
