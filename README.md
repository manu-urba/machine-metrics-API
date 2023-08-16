## Installation

```bash
$ npm install
```

## ⚡ Running the app

### 💻 Setting up local environment

```dotenv
# .env.local
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_DBNAME=
API_VERSION=1.0.0
ALLOWED_API_KEYS=key1,key2,key3
PER_PAGE_MAXIMUM_ITEMS=50

```

### 🚀 Running the API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Test

### 🐳 Starting local test database
⚠️ **Warning**: **the mssql server image is designed to run on x86_64 (Intel) architecture, MacOS or Linux users have to enable Rosetta for x86/amd emulation:**
1. Once Docker Desktop is running, open the Dashboard and go into Settings
2. Find the “Features in development” option, and select the “Use Rosetta for x86/amd64 emulation on Apple Silicon” checkbox

This repo comes with a mssql server 2022 docker container, if you want to use a local database. Skip this step if you use an AWS RDS database. Execute this script to start it.

```bash
$ npm run db
```

### 💻 Setting up local test environment

```dotenv
# .env.local.test
DATABASE_HOST=localhost
DATABASE_PORT=1433
DATABASE_USERNAME=sa
DATABASE_PASSWORD=DummyPassw0rdForTesting!!
DATABASE_DBNAME=master
ALLOWED_API_KEYS=mav_ODqOy0KcWW2oLX_ramNUwPjpwG2DU1G8,mav_kcUN0m3pJFTx5hw2EhlOO10ye4w7_NhB
PER_PAGE_MAXIMUM_ITEMS=50
```

### 🧬 Running tests
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📝 Commit Emoji Convention
This project follows the Gitmoji commit convention. Each commit message is prefixed with an emoji that represents the nature of the change. For example:

🐛 :bug: for bug fixes\
✅ :white_check_mark: for tests\
✨ :sparkles: for new features

For a complete list of available emojis and their meanings, refer to the [Gitmoji](https://gitmoji.dev/) website.
