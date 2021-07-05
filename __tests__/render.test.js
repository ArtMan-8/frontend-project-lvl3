import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/dom';
import i18next from 'i18next';
import app from '../src/app';
import { DEFAULT_LANGUAGE, Feedback } from '../src/const';
import resources from '../src/locales';
import renderContent from '../src/renders/renderContent';
import renderMessage from '../src/renders/renderMessage';
import renderModal from '../src/renders/renderModal';

const pathToIndex = path.join('__fixtures__', 'index.html');
const contentPath = path.join('__fixtures__', 'posts.html');
const modalPath = path.join('__fixtures__', 'modal.html');
const content = fs.readFileSync(contentPath, 'utf-8');
const modal = fs.readFileSync(modalPath, 'utf-8');

describe('Test renders', () => {
  const interact = {};

  beforeEach(async () => {
    document.body.innerHTML = fs.readFileSync(pathToIndex, 'utf-8');
    interact.contentContainer = screen.getByTestId('content');

    interact.feedsContainer = screen.getByTestId('feeds');
    interact.postsContainer = screen.getByTestId('posts');
    interact.modalContainer = screen.getByTestId('modal');
    interact.feedbackContainer = screen.getByTestId('feedback');

    interact.i18nextInstance = i18next.createInstance();
    interact.i18nextInstance.init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: Object.keys(resources),
      resources,
    });

    interact.selectedPost = {
      title: 'Lorem ipsum 2021-07-05T16:04:00Z',
      description: 'Consectetur duis nulla labore eiusmod sit aliqua ullamco fugiat.',
      link: 'http://example.com/test/1625501040',
    };

    interact.watchedState = {
      currentFeed: 'http://lorem-rss.herokuapp.com/feed',
      feeds: [
        {
          url: 'http://lorem-rss.herokuapp.com/feed',
          title: 'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)',
          description: 'This is a constantly updating lorem ipsum feed',
        },
      ],
      watchedPosts: new Set().add('Lorem ipsum 2021-07-05T15:17:00Z'),
      posts: new Map([
        ['http://lorem-rss.herokuapp.com/feed', [
          {
            title: 'Lorem ipsum 2021-07-05T15:20:00Z',
            description: 'Officia consectetur aute elit enim cupidatat fugiat ut.',
            link: 'http://example.com/test/1625498400',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:19:00Z',
            description: 'Id occaecat nisi amet mollit ut officia commodo.',
            link: 'http://example.com/test/1625498340',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:18:00Z',
            description: 'Dolor exercitation non nostrud laborum occaecat sit consequat.',
            link: 'http://example.com/test/1625498280',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:17:00Z',
            description: 'Esse dolore eiusmod nulla exercitation cillum ex.',
            link: 'http://example.com/test/1625498220',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:16:00Z',
            description: 'Magna pariatur ullamco reprehenderit ex eu ad eu commodo ullamco in.',
            link: 'http://example.com/test/1625498160',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:15:00Z',
            description: 'Minim incididunt Lorem ipsum dolore.',
            link: 'http://example.com/test/1625498100',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:14:00Z',
            description: 'Ad sint incididunt Lorem irure id est aliqua aliqua est proident cillum.',
            link: 'http://example.com/test/1625498040',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:13:00Z',
            description: 'Reprehenderit irure excepteur dolor adipisicing anim do dolore nisi est.',
            link: 'http://example.com/test/1625497980',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:12:00Z',
            description: 'Tempor proident sint proident commodo eiusmod id ea quis irure deserunt.',
            link: 'http://example.com/test/1625497920',
          },
          {
            title: 'Lorem ipsum 2021-07-05T15:11:00Z',
            description: 'Excepteur eiusmod eu est laboris quis incididunt est nisi incididunt eu dolor dolor pariatur.',
            link: 'http://example.com/test/1625497860',
          },
        ]],
      ]),
    };

    await app();
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

    waitFor(async () => {
      expect(await interact.containers.contentContainer).toContainHTML(content);
    });
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

    waitFor(async () => {
      expect(await interact.containers.contentContainer).toContainHTML();
    });
  });

  test('render modal', async () => {
    interact.watchedState = {
      message: Feedback.NETWORK_ERROR,
    };

    renderModal(
      interact.modalContainer,
      interact.i18nextInstance,
      interact.selectedPost,
    );

    waitFor(async () => {
      expect(await interact.modalContainer).toContainHTML(modal);
    });
  });

  test('success message', async () => {
    interact.watchedState = {
      message: Feedback.SUCCESS_FETCH,
    };

    renderMessage(
      interact.feedbackContainer,
      interact.i18nextInstance,
      interact.watchedState,
    );

    waitFor(async () => {
      expect(await interact.feedbackContainer).toHaveClass('m-2 mt-0 position-absolute small text-info');
    });
  });

  test('error message', async () => {
    interact.watchedState = {
      message: Feedback.NETWORK_ERROR,
    };

    renderMessage(
      interact.feedbackContainer,
      interact.i18nextInstance,
      interact.watchedState,
    );

    waitFor(async () => {
      expect(await interact.feedbackContainer).toHaveClass('m-2 mt-0 position-absolute small text-warning');
    });
  });
});
