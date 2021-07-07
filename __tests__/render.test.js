import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import i18next from 'i18next';
import app from '../src/app';
import { DEFAULT_LANGUAGE, Feedback } from '../src/const';
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
      title: 'Lorem ipsum 2021-07-07T08:33:00Z',
      description: 'Laboris ea non culpa mollit eiusmod aliqua in dolor nulla ullamco ea consequat eu.',
      link: 'http://example.com/test/1625646780',
    };

    interact.watchedState = {
      currentFeed: 'http://lorem-rss.herokuapp.com/feed',
      feeds: [
        {
          url: 'http://lorem-rss.herokuapp.com/feed',
          title:
            'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)',
          description: 'This is a constantly updating lorem ipsum feed',
        },
      ],
      watchedPosts: new Set().add('Lorem ipsum 2021-07-07T08:35:00Z'),
      posts: new Map([
        [
          'http://lorem-rss.herokuapp.com/feed',
          [
            {
              title: 'Lorem ipsum 2021-07-07T08:35:00Z',
              description: 'Incididunt quis exercitation ad aliquip ut.',
              link: 'http://example.com/test/1625646900',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:34:00Z',
              description: 'Sunt voluptate excepteur enim id Lorem.',
              link: 'http://example.com/test/1625646840',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:33:00Z',
              description: 'Laboris ea non culpa mollit eiusmod aliqua in dolor nulla ullamco ea consequat eu.',
              link: 'http://example.com/test/1625646780',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:32:00Z',
              description: 'Anim ea ea qui enim do incididunt ipsum.',
              link: 'http://example.com/test/1625646720',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:31:00Z',
              description: 'Qui ullamco mollit in eiusmod enim magna culpa.',
              link: 'http://example.com/test/1625646660',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:30:00Z',
              description: 'Sit amet proident sit duis ut commodo tempor magna incididunt.',
              link: 'http://example.com/test/1625646600',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:29:00Z',
              description: 'Labore veniam qui sit esse pariatur aliqua esse culpa proident excepteur cillum.',
              link: 'http://example.com/test/1625646540',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:28:00Z',
              description: 'Excepteur irure consequat excepteur cupidatat dolor amet mollit voluptate culpa.',
              link: 'http://example.com/test/1625646480',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:27:00Z',
              description: 'Consequat elit eiusmod consectetur do non Lorem exercitation minim sit.',
              link: 'http://example.com/test/1625646420',
            },
            {
              title: 'Lorem ipsum 2021-07-07T08:26:00Z',
              description: 'Nostrud eu culpa commodo sit labore consectetur tempor qui do in culpa ipsum do.',
              link: 'http://example.com/test/1625646360',
            },
          ],
        ]]),
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
      posts: new Map(),
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

  test('success message', async () => {
    interact.watchedState = {
      message: Feedback.SUCCESS_FETCH,
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

  test('error message', async () => {
    interact.watchedState = {
      message: Feedback.NETWORK_ERROR,
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