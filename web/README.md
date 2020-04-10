# Messenger Web Application

## Environment variables

Webpack is expecting to have 2 .env files each for development and production:
- .dev.env
- .prod.env

These files should contain server url definitions, for example:

`
API_URL=http://localhost:8080/api
GRAPHQL_URL=http://localhost:8080/graphql
WS_URL=ws://localhost:8080/ws
`