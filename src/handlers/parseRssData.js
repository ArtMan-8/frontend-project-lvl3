export default function parseRssData(rss) {
  const parser = new DOMParser();
  const parseData = parser.parseFromString(rss, 'application/xml');

  const feed = {
    title: parseData.querySelector('title').textContent,
    description: parseData.querySelector('description').textContent,
  };

  const posts = [...parseData.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { feed, posts };
}
