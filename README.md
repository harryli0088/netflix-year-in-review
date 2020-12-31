# Netflix Year In Review

## Client Deploy

Follow this tutorial to deploy a CRA on github pages https://create-react-app.dev/docs/deployment/#github-pages

## Server Deploy

Follow this tutorial to deploy to heroku https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up. After you run the ```heroku create``` command, make sure to set the server url in ```client/env.production.local```.

### Deploy a subdirectory to heroku
```
git subtree push --prefix server heroku main
```

### Setting up environment variables in heroku
```
heroku config:set YOUR_ENV_VARIABLE=value
```
