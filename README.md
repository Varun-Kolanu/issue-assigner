# csoc-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A bot for managing workflow of CSOC projects

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t csoc-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> csoc-bot
```

## Contributing

If you have suggestions for how csoc-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 Varun Kolanu
