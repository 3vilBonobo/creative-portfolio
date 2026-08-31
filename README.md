# Creative Portfolio

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Deploy to Netlify

The repository includes `netlify.toml`, so Netlify automatically uses Node 22,
runs the Vite production build, and publishes the generated `dist` directory.

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Netlify](https://app.netlify.com/) and select **Add new project**,
   then **Import an existing project**.
3. Connect the Git provider and select this repository.
4. Leave the detected build settings as they are:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Select **Deploy**.

Netlify enables continuous deployment for an imported Git repository. Every
push to the production branch (usually `main`) triggers a new production build
and updates the live site. Pushes to other branches and pull requests can create
Deploy Previews without replacing the production site.

To use a custom domain, open the site in Netlify and go to **Domain management**,
then choose **Add a domain** and follow the DNS instructions.
