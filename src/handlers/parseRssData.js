import _ from 'lodash';

export default function parseRssData(rss) {
  const parser = new DOMParser();
  const parseData = parser.parseFromString(rss, 'application/xml');
  const feedId = _.uniqueId();

  const feed = {
    id: feedId,
    title: parseData.querySelector('title').textContent,
    description: parseData.querySelector('description').textContent,
  };

  const posts = [...parseData.querySelectorAll('item')].map((item) => ({
    id: _.uniqueId(),
    feedId,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { feed, posts };
}
