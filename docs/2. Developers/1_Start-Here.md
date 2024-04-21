# Starting as a developer

## Prerequisites

If you don't have Docker, VSCode, and a dev environment checkout the [Environment Setup](/2.%20Developers/0_Environment-Setup.md).

## Getting Started

1. Find a [good first issue](https://github.com/internetarchive/openlibrary/issues?q=is%3Aopen+is%3Aissue+label%3A%22Good+First+Issue%22+) you're interested in!
2. `docker compose up`
3. Change a a file
  - `.html`, `.py` - changes should be reflected when you refresh
  - `.less` - you'll have to run: `docker compose run --rm home make css`
  - `.js` - you'll have to run: `docker compose run --rm home make js`
4. Write/run tests if needed
  - `docker compose run --rm home make test`
5. Open a PR
  - Please include a video of your change (or at least screenshots)
6. Your PR will be reviewed/merged in about one week! 🎉

## What's next?
- [Import production data](/2.%20Developers/misc/Loading-Production-Book-Data.md)
- Checkout the architecture of the app
- Write a bot for us
- Improve the docs
- Help us develop a whole new feature
