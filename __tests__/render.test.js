import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import i18next from 'i18next';
import app from '../src/app';
import { DEFAULT_LANGUAGE, feedback } from '../src/constants';
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
      title: 'Lorem ipsum 2021-07-17T08:49:00Z',
      description: 'Irure in ullamco consectetur laboris nulla.',
      link: 'http://example.com/test/1626511740',
    };

    interact.watchedState = {
      feeds: [
        {
          url: 'http://lorem-rss.herokuapp.com/feed',
          title:
            'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)',
          description: 'This is a constantly updating lorem ipsum feed',
        },
      ],
      ui: {
        watchedPosts: new Set().add('Lorem ipsum 2021-07-07T08:35:00Z'),
      },
      posts: [{
        title: 'Lorem ipsum 2021-07-17T08:49:00Z',
        description: 'Irure in ullamco consectetur laboris nulla.',
        link: 'http://example.com/test/1626511740',
      },
      {
        title: 'Lorem ipsum 2021-07-17T08:48:00Z',
        description: 'Ullamco exercitation adipisicing labore exercitation officia non.',
        link: 'http://example.com/test/1626511680',
      },
      {
        title: 'Lorem ipsum 2021-07-17T08:47:00Z',
        description: 'Commodo enim irure do sunt commodo.',
        link: 'http://example.com/test/1626511620',
      },
      {
        title: 'Lorem ipsum 2021-07-17T08:46:00Z',
        description: 'Non voluptate aliqua qui voluptate sunt sunt sint minim pariatur deserunt.',
        link: 'http://example.com/test/1626511560',
      }],
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

  test('success feedback', async () => {
    const isError = false;
    interact.watchedState.feedback = feedback.SUCCESS_FETCH;

    renderMessage(isError)(
      interact.feedbackr,
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedbackr).toHaveClass(
      'm-2 mt-0 position-absolute small text-info',
    );
  });

  test('error feedback', async () => {
    const isError = true;
    interact.watchedState.feedback = feedback.NETWORK_ERROR;

    renderMessage(isError)(
      interact.feedbackr,
      interact.i18nextInstance,
      interact.watchedState,
    );

    expect(await interact.feedbackr).toHaveClass(
      'm-2 mt-0 position-absolute small text-warning',
    );
  });
});
