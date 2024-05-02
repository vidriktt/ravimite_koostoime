# Ravimite koostoime
<br>

### Web application for checking drug interactions in Estonian.
<br>

#### Developed as part of a practical thesis in 2024.
#### Author: Vidrik Toom Tabas
<br>

## Project setup
```bash
# add local environment variables
$ cp .env-default .env
$ vim .env

# use correct node version
$ nvm use

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production
$ npm run build

# preview static project
$ npm run preview
```
<br>

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
|:------------------|:---------------------------------------------|
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./output/`    |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run lint`    | Run linters for JS, style & prettier         |
| `npm run lintfix` | Fix lint errors                              |
<br>

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
