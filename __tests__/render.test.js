import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import i18next from 'i18next';
import app from '../src/app';
import { DEFAULT_LANGUAGE, message } from '../src/constants';
import resources from '../src/locales';
import renderContent from '../src/renders/renderContent';
import renderMessage from '../src/renders/renderMessage';
import renderModal from '../src/renders/renderModal';

const pathToIndex = path.join('__fixtures__', 'index.html');
const index = fs.readFileSync(pathToIndex, 'utf-8');

const feedsPath = path.join('__fixtures__', 'feeds.html');
const feeds = fs.readFileSync(feedsPath, 'utf-8');

const postsPath = path.join('__fixtures__', 'posts.html');
const posts = fs.readFileSync(postsPath, 'utf-8');

describe('Test renders', () => {
  const interact = {};

  beforeEach(async () => {
    document.body.innerHTML = index;

    interact.feedsContainer = screen.getByTestId('feeds');
    interact.postsContainer = screen.getByTestId('posts');
    interact.modalContainer = screen.getByTestId('modal');
    interact.feedbackr = screen.getByRole('status', { name: 'feedback' });

    interact.i18nextInstance = i18next.createInstance();
    interact.i18nextInstance.init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: Object.keys(resources),
      resources,
    });

    interact.selectedPost = {
      id: '2',
      feedId: '1',
      title: 'Lorem ipsum 2021-07-31T16:25:00Z',
      description: 'Consequat Lorem do non proident elit exercitation reprehenderit excepteur ut proident aliquip veniam dolore esse.',
      link: 'http://example.com/test/1627748700',
    };

    interact.watchedState = {
      feeds: [
        {
          id: '1',
          title: 'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)',
          description: 'This is a constantly updating lorem ipsum feed',
        },
      ],
      ui: {
        watchedPosts: new Set().add('2'),
      },
      posts: [
        {
          id: '2',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:25:00Z',
          description: 'Consequat Lorem do non proident elit exercitation reprehenderit excepteur ut proident aliquip veniam dolore esse.',
          link: 'http://example.com/test/1627748700',
        },
        {
          id: '3',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:24:00Z',
          description: 'Culpa duis elit fugiat adipisicing culpa consectetur ut ad sint consequat.',
          link: 'http://example.com/test/1627748640',
        },
        {
          id: '4',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:23:00Z',
          description: 'Lorem mollit do officia laboris do.',
          link: 'http://example.com/test/1627748580',
        },
        {
          id: '5',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:22:00Z',
          description: 'Aute aliqua consectetur eu ad id nisi minim enim mollit veniam.',
          link: 'http://example.com/test/1627748520',
        },
        {
          id: '6',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:21:00Z',
          description: 'Deserunt laborum laboris commodo Lorem duis sint sunt magna dolore cillum nostrud consectetur anim in.',
          link: 'http://example.com/test/1627748460',
        },
        {
          id: '7',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:20:00Z',
          description: 'Do dolore dolor do ut anim.',
          link: 'http://example.com/test/1627748400',
        },
        {
          id: '8',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:19:00Z',
          description: 'Consequat amet cupidatat fugiat est laborum elit.',
          link: 'http://example.com/test/1627748340',
        },
        {
          id: '9',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:18:00Z',
          description: 'Duis duis amet aute ad dolore incididunt occaecat occaecat cupidatat proident adipisicing.',
          link: 'http://example.com/test/1627748280',
        },
        {
          id: '10',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:17:00Z',
          description: 'Pariatur velit tempor dolor nulla dolore ullamco excepteur pariatur quis reprehenderit anim aliquip.',
          link: 'http://example.com/test/1627748220',
        },
        {
          id: '11',
          feedId: '1',
          title: 'Lorem ipsum 2021-07-31T16:16:00Z',
          description: 'In irure duis veniam sint.',
          link: 'http://example.com/test/1627748160',
        },
      ],
    };

    await app();
  });

  test('Ru locales', async () => {
    expect(await screen.findByText('RSS агрегатор')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Начните читать RSS сегодня! Это легко, это красиво.',
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText('Добавить')).toBeInTheDocument();
  });

  test('content', async () => {
    renderContent(
      {
        feedsContainer: interact.feedsContainer,
        postsContainer: interact.postsContainer,
      },
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedsContainer).toContainHTML(feeds);
    expect(await interact.postsContainer).toContainHTML(posts);
  });

  test('no content', async () => {
    interact.watchedState = {
      feeds: [],
      posts: [],
    };

    renderContent(
      {
        feedsContainer: interact.feedsContainer,
        postsContainer: interact.postsContainer,
      },
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedsContainer).toBeEmptyDOMElement();
    expect(await interact.postsContainer).toBeEmptyDOMElement();
  });

  test('render modal', async () => {
    renderModal(
      interact.modalContainer,
      interact.i18nextInstance,
      interact.selectedPost,
    );

    expect(await screen.findByText(interact.selectedPost.title)).toBeInTheDocument();
    expect(await screen.findByText(interact.selectedPost.description)).toBeInTheDocument();
  });

  test('success feedback', async () => {
    interact.watchedState.rssForm = {
      error: null,
    };

    renderMessage(
      interact.feedbackr,
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedbackr).toHaveClass(
      'm-2 mt-0 position-absolute small text-info',
    );
  });

  test('error feedback', async () => {
    interact.watchedState.rssForm = {
      error: message.NETWORK_ERROR,
    };

    renderMessage(
      interact.feedbackr,
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedbackr).toHaveClass(
      'm-2 mt-0 position-absolute small text-warning',
    );
  });
});
