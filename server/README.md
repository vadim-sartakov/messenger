# Messenger Server

## Environment variables
To run the server there are following environment variables should be set:
- PORT - server port. Default is 8080
- JWT_SECRET - string password for HS256 jwt encoding (used if no key pairs were found)
- JWT_EXPIRES_IN - amount of time a jwt token will be valid for. Compatible with [zeit/ms](https://github.com/zeit/ms) format
- USER_EXPIRES_IN - Period after which user is considered as expired so user and all related data allowed to be removed. Compatible with [zeit/ms](https://github.com/zeit/ms) format
- CLEANUP_PERIOD - Cleanup task will run with this period. Compatible with [zeit/ms](https://github.com/zeit/ms) format
- DB_URL - connection to database
- WEB_APP_URL - to enable CORS
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

Server utilizes [debug](https://www.npmjs.com/package/debug) package for logging. To enable logs it is required to set `DEBUG` env variable. The following namaspaces supported:
- app:info, app:error - general app logs
- cleanup:info - cleanup periodic task