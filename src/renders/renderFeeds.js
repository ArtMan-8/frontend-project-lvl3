const createFeedsContainer = () => {
  const container = document.createElement('div');
  container.setAttribute('class', 'card border-0');
  return container;
};

const createFeedsHeader = (i18nextInstance) => {
  const header = document.createElement('div');
  header.setAttribute('class', 'card-body');
  header.innerHTML = `<h2 class="card-title h4">${i18nextInstance.t(
    'feeds',
  )}</h2>`;
  return header;
};

const createFeedsItem = (id, title, description) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  li.setAttribute('data-id', id);

  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  h3.textContent = title;

  const p = document.createElement('p');
  p.setAttribute('class', 'm-0 small text-black-50');
  p.textContent = description;

  li.append(h3);
  li.append(p);

  return li;
};

const createFeedsList = (feeds) => {
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group border-0 rounded-0');

  feeds.forEach(({ id, title, description }) => {
    const feedItem = createFeedsItem(id, title, description);
    ul.append(feedItem);
  });

  return ul;
};

export default function renderFeeds(
  feedsContainer,
  i18nextInstance,
  watchedState,
) {
  const { feeds } = watchedState;
  if (feeds.length) {
    feedsContainer.innerHTML = '';
    const container = createFeedsContainer();
    const header = createFeedsHeader(i18nextInstance);
    const feedList = createFeedsList(feeds);

    container.append(header);
    container.append(feedList);
    feedsContainer.append(container);
  }
}
