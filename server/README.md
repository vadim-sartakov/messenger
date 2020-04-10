# Messenger Server

## Key pairs

In order, to issue and verify JWT tokens we need key pair generated. To do so, run the following script:

```
node scripts/generateKeyPair.js
```

This will create keys in server root directory which will be used to issue and verify JWT tokens.

## Environment variables
In order to run server there are following environment variables should be set:
- DB_URL - connection to database
- WEB_APP_URL - to enable CORS
