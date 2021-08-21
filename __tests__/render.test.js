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

    interact.watchedState = {
      ui: {
        selectedPost: '2',
        watchedPosts: new Set().add('2'),
      },
      feeds: [
        {
          id: '1',
          title: 'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)',
          description: 'This is a constantly updating lorem ipsum feed',
        },
      ],
      posts: [
        {
          id: '2',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:57:00Z',
          description: 'Amet incididunt duis consectetur occaecat occaecat pariatur duis aute veniam elit.',
          link: 'http://example.com/test/1629536220',
        },
        {
          id: '3',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:56:00Z',
          description: 'Culpa officia consequat ut excepteur occaecat est reprehenderit tempor voluptate tempor consequat.',
          link: 'http://example.com/test/1629536160',
        },
        {
          id: '4',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:55:00Z',
          description: 'Occaecat magna velit incididunt incididunt ea sunt tempor qui laboris nostrud adipisicing fugiat sint.',
          link: 'http://example.com/test/1629536100',
        },
        {
          id: '5',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:54:00Z',
          description: 'Dolor enim eiusmod irure Lorem nostrud ut nisi.',
          link: 'http://example.com/test/1629536040',
        },
        {
          id: '6',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:53:00Z',
          description: 'Non mollit fugiat exercitation ullamco incididunt mollit nulla do minim duis.',
          link: 'http://example.com/test/1629535980',
        },
        {
          id: '7',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:52:00Z',
          description: 'Est laborum occaecat commodo irure magna amet nulla eiusmod cillum pariatur excepteur et.',
          link: 'http://example.com/test/1629535920',
        },
        {
          id: '8',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:51:00Z',
          description: 'Ea fugiat anim dolor laboris laboris voluptate veniam elit sunt ipsum.',
          link: 'http://example.com/test/1629535860',
        },
        {
          id: '9',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:50:00Z',
          description: 'Aute eu ipsum laboris laboris culpa voluptate consequat non excepteur excepteur sit.',
          link: 'http://example.com/test/1629535800',
        },
        {
          id: '10',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:49:00Z',
          description: 'Veniam adipisicing mollit esse in est.',
          link: 'http://example.com/test/1629535740',
        },
        {
          id: '11',
          feedId: '1',
          title: 'Lorem ipsum 2021-08-21T08:48:00Z',
          description: 'Minim veniam dolore duis duis nulla sit laboris elit.',
          link: 'http://example.com/test/1629535680',
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
      interact.watchedState,
    );

    const { title, description } = interact.watchedState.posts
      .find(({ id }) => id === interact.watchedState.ui.selectedPost);

    expect(await screen.findByText(title)).toBeInTheDocument();
    expect(await screen.findByText(description)).toBeInTheDocument();
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
