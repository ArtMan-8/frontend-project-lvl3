import _ from 'lodash';

export default function normalizeRssData(parsedData) {
  const feedId = _.uniqueId();

  const feed = {
    ...parsedData.feed,
    id: feedId,
  };

  const posts = parsedData.posts.map((item) => ({
    ...item,
    id: _.uniqueId(),
    feedId,
  }));

  return { feed, posts };
}
