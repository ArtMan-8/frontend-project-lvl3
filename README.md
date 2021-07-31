# RSS агрегатор

[![Actions Status](https://github.com/ArtMan-8/frontend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/ArtMan-8/frontend-project-lvl3/actions) [![Project test & build](https://github.com/ArtMan-8/frontend-project-lvl3/actions/workflows/build.yml/badge.svg)](https://github.com/ArtMan-8/frontend-project-lvl3/actions/workflows/build.yml)<br />
[![Maintainability](https://api.codeclimate.com/v1/badges/c2a2d91a7c26b5fe09d3/maintainability)](https://codeclimate.com/github/ArtMan-8/frontend-project-lvl3/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c2a2d91a7c26b5fe09d3/test_coverage)](https://codeclimate.com/github/ArtMan-8/frontend-project-lvl3/test_coverage) <br />

## Описание
Сервис для агрегации RSS-потоков, с помощью которых удобно читать разнообразные источники, например, блоги. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток.

### Инструменты
- сборка **webpack**
- вёрстка с ипользованием **bootstrap**
- организация текстов интерфейса через **i18next**
- запросы через **axios**
- тестирование с использованием **testing-library**
- насторены **pre-commit** и **pre-push** хуки


---
### Использование

```bash
$ make install        - Установка зависимостей
$ make lint           - Запуск линтинга
$ make test           - Запуск тестов
$ make test-watch     - Запуск тестов, в режиме наблюдения
$ make test-coverage  - Запуск тестов с покрытием
$ make dev            - Запуск в режиме разработки
$ make build          - Сборока проекта
```

### **<a target="_blank" href="https://artman-8.github.io/frontend-project-lvl3/">Посмотреть RSS App онлайн</a>**