import fs from 'fs';
import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import app from '../src/app';

axios.defaults.adapter = httpAdapter;
nock.disableNetConnect();

const pathToIndex = path.join('__fixtures__', 'index.html');
const pathToRssResponse = path.join('__fixtures__', 'rssResponse.json');
const pathToNotRssResponse = path.join('__fixtures__', 'notRssResponse.json');

const rssResponse = fs.readFileSync(pathToRssResponse, 'utf-8');
const notRssResponse = fs.readFileSync(pathToNotRssResponse, 'utf-8');

const proxyUrl = 'https://hexlet-allorigins.herokuapp.com';
const rssUrl = 'http://lorem-rss.herokuapp.com';

const initNock = (url, response) => {
  nock(proxyUrl)
    .get('/get')
    .query({ url, disableCache: true })
    .reply(200, response);
};

describe('Test RSS App', () => {
  const interact = {};

  beforeEach(async () => {
    document.body.innerHTML = fs.readFileSync(pathToIndex, 'utf-8');
    interact.rssInput = screen.getByRole('textbox', { name: 'url' });
    interact.submitButton = screen.getByRole('button', { name: 'add' });
    interact.feedback = screen.getByRole('status', { name: 'feedback' });
    await app();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('The link must be a valid URL', async () => {
    userEvent.type(interact.rssInput, 'not rss url');
    userEvent.click(interact.submitButton);

    expect(
      await screen.findByText('Ссылка должна быть валидным URL'),
    ).toBeInTheDocument();
  });

  test('Network error', async () => {
    initNock();
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    expect(await screen.findByText('Ошибка сети')).toBeInTheDocument();
  });

  test('Resource does not contain valid RSS', async () => {
    initNock(`${rssUrl}/invalidRss`, notRssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/invalidRss`);
    userEvent.click(interact.submitButton);

    expect(
      await screen.findByText('Ресурс не содержит валидный RSS'),
    ).toBeInTheDocument();
  });

  test('RSS loaded successfully', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    expect(await screen.findByText('RSS успешно загружен')).toBeInTheDocument();
  });

  test('RSS is exist', async () => {
    initNock(`${rssUrl}/feed`, rssResponse);
    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    expect(await screen.findByText('RSS успешно загружен')).toBeInTheDocument();

    userEvent.type(interact.rssInput, `${rssUrl}/feed`);
    userEvent.click(interact.submitButton);

    expect(await screen.findByText('RSS уже существует')).toBeInTheDocument();
  });
});
