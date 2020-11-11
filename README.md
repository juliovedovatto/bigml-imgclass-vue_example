# bigml-imgclass-vue

The intent of this project is to act as Front end interface for uploading images to BigML, to be able to train machine learning. This application allow user upload images in a `.zip` file, organized by folders, then use BigML machine learning API to train your neural network there, to identify images with high accuracy.

## Tecnologies

Everything you need to know to work on this project.

### Vue environment

#### Vue

```
Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects.
```

Useful links:

* [Getting started](https://vuejs.org/v2/guide/#Getting-Started)
* [Style guide](https://vuejs.org/v2/style-guide/)
* [Single File Components](https://vuejs.org/v2/guide/single-file-components.html)
* [API](https://vuejs.org/v2/api/)

#### vue-cli

```
Standard Tooling for Vue.js Development. Vue CLI is a full system for rapid Vue.js development.
```

Useful links:

* [Getting started](https://cli.vuejs.org/guide/)
* [API](https://cli.vuejs.org/config/)

#### vue-router

```
Vue Router is the official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze.
```

Useful links:

* [Getting started](https://router.vuejs.org/guide/)
* [API](https://router.vuejs.org/api/)

#### vue-i18n

```
Vue I18n is internationalization plugin of Vue.js. It easily integrates some localization features to your Vue.js Application.
```

Useful links:

* [Getting started](https://kazupon.github.io/vue-i18n/started.html)
* [API](https://kazupon.github.io/vue-i18n/api/)

#### Vuex

```
Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.
```

Useful links:

* [Getting started](https://vuex.vuejs.org/guide/)
* [API](https://vuex.vuejs.org/api/)

#### Vuetify

```
Vuetify is a Vue UI Library with beautifully handcrafted Material Components. No design skills required — everything you need to create amazing applications is at your fingertips.
```

Useful links:

* [Why Vuetify?](https://vuetifyjs.com/en/introduction/why-vuetify/)
* [Getting Started](https://vuetifyjs.com/en/getting-started/installation/)
* [API](https://vuetifyjs.com/en/api/vuetify/)

### Styling

#### Sass

```
Sass (short for syntactically awesome style sheets) is a preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets (CSS). SassScript is the scripting language itself.

Sass consists of two syntaxes. The original syntax, called "the indented syntax," uses a syntax similar to Haml.[2] It uses indentation to separate code blocks and newline characters to separate rules. The newer syntax, "SCSS" (Sassy CSS), uses block formatting like that of CSS. It uses braces to denote code blocks and semicolons to separate rules within a block. The indented syntax and SCSS files are traditionally given the extensions .sass and .scss, respectively.
```

Useful links:

* [Documentation](https://sass-lang.com/documentation)


### Testing

#### Jest

```
Jest is a delightful JavaScript Testing Framework with a focus on simplicity and support for large web applications.
```

Useful links:

* [Getting started](https://jestjs.io/docs/en/getting-started)
* [API](https://jestjs.io/docs/en/api)

#### vue-test-utils

```
Vue Test Utils is the official unit testing utility library for Vue.js.
```

Useful links:

* [Getting started](https://vue-test-utils.vuejs.org/guides/getting-started.html)
* [API](https://vue-test-utils.vuejs.org/api/)

### Bundler

#### Webpack

```
At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles. It can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. Webpack takes modules with dependencies and generates static assets representing those modules.

Webpack takes the dependencies and generates a dependency graph allowing web developers to use a modular approach for their web application development purposes. It can be used from the command line, or can be configured using a config file which is named webpack.config.js. This file is used to define rules, plugins, etc., for a project. (webpack is highly extensible via rules which allow developers to write custom tasks that they want to perform when bundling files together.)
```

* [Getting started](https://webpack.js.org/concepts/)
* [The vue-cli integration](https://cli.vuejs.org/guide/webpack.html)
* [API](https://webpack.js.org/api/)


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

