# KSS ♥ brunch.io

Integrates the [kss-node](https://github.com/kss-node/kss-node) living styleguide generator into your [brunch.io](http://brunch.io/) builds.

The plugin will generate the KSS node styleguide into `<public>/styleguide`.


## Usage

Install the plugin via npm with `npm install --save-dev kssbrunch` or `yarn add kssbrunch -D`.


## Options

Put all options for this plugin into the `config.plugins.kss` object, for example:


```javascript
// file: brunch-config.js

module.exports = {
  plugins: {
    kss: {
      // include generated CSS files in the KSS styleguide. Defaults to true. 
      addCssFiles: true,
      // include generated JS files in the KSS styleguide. Defaults to true.
      addJsFiles: false,
      
      // kss-node specific config
      kssConfig: {
        // will be passed to kss-node
      }
    }
  }
};
```
See all possible options for the `kssConfig` object in the [kss-node documentation](https://github.com/kss-node/kss-node#using-the-command-line-tool).


## Contributing

Open a PR :-)


## [Change Log](CHANGELOG.md)

See all changes made to this project in the [change log](CHANGELOG.md). This project follows [semantic versioning](http://semver.org/).


## [License](LICENSE)

This project is licensed under the terms of the [MIT license](LICENSE).


---

Project created and maintained by [Fabian Keller](http://www.fabian-keller.de).
