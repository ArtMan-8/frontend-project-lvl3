import fs from 'fs';
import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import app from '../src/app';

axios.defaults.adapter = httpAdapter;

const pathToIndex = path.join('__fixtures__', 'index.html');
const pathToRssResponse = path.join('__fixtures__', 'rssResponse.json');
const pathToNotRssResponse = path.join('__fixtures__', 'notRssResponse.json');

const rssResponse = fs.readFileSync(pathToRssResponse, 'utf-8');
const notRssResponse = fs.readFileSync(pathToNotRssResponse, 'utf-8');

const proxyUrl = 'https://hexlet-allorigins.herokuapp.com';
const rssUrl = 'http://lorem-rss.herokuapp.com';

const initNock = (url, response) => {
  const encodeURI = encodeURIComponent(url);
  nock(proxyUrl)
    .persist()
    .get(new RegExp(encodeURI))
    .reply(200, response);
};

describe('Test RSS App', () => {
  const interact = {};

  beforeEach(async () => {
    nock.disableNetConnect();
    document.body.innerHTML = fs.readFileSync(pathToIndex, 'utf-8');
    interact.rssInput = screen.getByTestId('rss-input');
    interact.submitButton = screen.getByTestId('submit-button');
    interact.feedback = screen.getByTestId('feedback');
    await app();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('Ru locales', () => {
    waitFor(() => {
      expect(screen.getByText('RSS агрегатор')).toBeInTheDocument();
      expect(screen.getByText('Начните читать RSS сегодня! Это легко, это красиво.')).toBeInTheDocument();
      expect(screen.getByText('Добавить')).toBeInTheDocument();
    });
  });

  test('The link must be a valid URL', async () => {
    userEvent.type(interact.rssInput, 'not rss url');
    userEvent.click(interact.submitButton);
    waitFor(() => {
      expect(screen.findByText('Ссылка должна быть валидным URL')).toBeInTheDocument();
    });
  });

  test('Network error', async () => {
    initNock(`${rssUrl}/feed`, {});
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    waitFor(() => {
      expect(screen.findByText('Ошибка сети')).toBeInTheDocument();
    });
  });

  test('Resource does not contain valid RSS', async () => {
    initNock(`${rssUrl}/notRss`, notRssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/notRss`);
    userEvent.click(interact.submitButton);

    waitFor(() => {
      expect(screen.findByText('Ресурс не содержит валидный RSS')).toBeInTheDocument();
    });
  });

  test('RSS loaded successfully', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    waitFor(() => {
      expect(screen.findByText('RSS успешно загружен')).toBeInTheDocument();
    });
  });

  test('RSS is exist', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);

    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);
    waitFor(() => {
      expect(screen.findByText('RSS успешно загружен')).toBeInTheDocument();
    });

    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);
    waitFor(() => {
      expect(screen.findByText('RSS уже существует')).toBeInTheDocument();
    });
  });

  test('Feeds and posts', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    waitFor(() => {
      expect(screen.findByText('RSS успешно загружен')).toBeInTheDocument();
      expect(screen.getByTestId('feeds')).toContainHTML('Lorem ipsum feed for an interval of 1 minutes with 10 item(s)');
      expect(screen.getByTestId('posts')).toContainHTML('Lorem ipsum');
    });
  });

  test('Show modal', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    waitFor(async () => {
      screen.findByText('RSS успешно загружен');
      const openModal = await screen.getAllByText('Просмотр');
      userEvent.click(openModal[0]);
      expect(await screen.findByText('Velit sunt quis velit aliqua nisi dolore ut adipisicing do exercitation')).toBeVisible();
    });
  });
});
