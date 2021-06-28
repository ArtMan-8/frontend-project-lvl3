export const FormProcessState = {
  FILLING: 'filling',
  SENDING: 'sending',
  FINISHED: 'finished',
  FAILED: 'failed',
};

export default function processWatcher(containers, watchedState) {
  // console.log(watchedState.rssForm.processState);
  const { formInput, submitButton } = containers;
  switch (watchedState.rssForm.processState) {
    case FormProcessState.FAILED:
      watchedState.rssForm.processState = FormProcessState.FILLING;
      break;
    case FormProcessState.FILLING:
      formInput.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      break;
    case FormProcessState.SENDING:
      formInput.setAttribute('disabled', 'true');
      submitButton.setAttribute('disabled', 'true');
      break;
    case FormProcessState.FINISHED:
      watchedState.rssForm.processState = FormProcessState.FILLING;
      break;
    default:
      throw new Error(`Unknown state: ${watchedState}`);
  }
}
