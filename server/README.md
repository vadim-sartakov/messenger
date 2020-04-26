# Messenger Server

## Environment variables
Periodic variables are compatible with [zeit/ms](https://github.com/zeit/ms) format.
To run the server there are following environment variables should be set:
- PORT - server port. Default is 8080
- MONGODB_URI - connection to database
- JWT_SECRET - string password for HS256 jwt encoding (used if no key pairs were found)
- JWT_EXPIRES_IN - amount of time a jwt token will be valid for. Compatible with  format. Default is 24h
- USER_EXPIRES_IN - Period after which user is considered as expired so user and all related data allowed to be removed. Default is 24h
- CLIENT_PING_INTERVAL - Websocket client ping interval. Default is 15s
- CLIENT_CONNECTION_TIMEOUT - Interval after which websocket client considered disconnected. Default is 10s
- CLEANUP_PERIOD - Cleanup task will run with this period. Default is 1h
- CORS_ORIGIN - to enable CORS
- DEBUG - logging namespaces. Utilizing [debug](https://www.npmjs.com/package/debug) package.

## JWT Encoding

There are 2 supported JWT encryption by default: HS256 and RS256 - symmetric and asymmetric encryption.
In order, to issue and verify JWT tokens with asymmetric key pair it should be generated first. To do so, run the following script:
```
node scripts/generateKeyPair.js
```
This will create keys in server root directory which will be used to issue and verify JWT tokens.

Otherwise HS256 encoding will be used. Secret string should be provided with `JWT_SECRET` environment variable.

## Logging

Server utilizes [debug](https://www.npmjs.com/package/debug) package for logging. To enable logs it is required to set `DEBUG` env variable. The following namaspaces are supported:
- app:info, app:error - general app logs
- cleanup:info - cleanup periodic task

## Self signed certificates
For development purposes self signed certificates can be generated:
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./private-server.key -out public-server.key`