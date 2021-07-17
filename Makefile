install:
		npm install

lint:
		npx eslint .

test:
		npm test

test-watch:
		npm test -- --watch

test-coverage:
		npm test -- --coverage

dev:
		npm run start

build:
		npm run build