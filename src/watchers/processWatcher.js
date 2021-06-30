import { FormProcessState } from '../const';

export default function processWatcher(containers, watchedState) {
  const { formInput, submitButton } = containers;
  switch (watchedState.rssForm.processState) {
    case FormProcessState.FAILED:
      watchedState.rssForm.processState = FormProcessState.FILLING;
      break;
    case FormProcessState.FILLING:
      break;
    case FormProcessState.SENDING:
      formInput.setAttribute('disabled', 'true');
      submitButton.setAttribute('disabled', 'true');
      break;
    case FormProcessState.FINISHED:
      formInput.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      watchedState.rssForm.processState = FormProcessState.FILLING;
      break;
    default:
      throw new Error(`Unknown state: ${watchedState}`);
  }
}
