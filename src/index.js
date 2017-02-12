'use strict';

const kss = require('kss'),
  _ = require('lodash'),
  fs = require('fs');

const DEFAULT_OPTIONS = {
  /** include generated CSS files in the KSS styleguide */
  addCssFiles: true,
  /** include generated CSS files in the KSS styleguide */
  addJsFiles: true,

  /** options that are passed to kss-node */
  kssConfig: {},
};

class KssPlugin {

  constructor(config) {
    config = config || {plugins: {kss: {}}};
    this.brunchConfig = config;
    let sourceDestination;
    if (_.isNil(config.paths)) {
      sourceDestination = {};
    } else {
      sourceDestination = {
        kssConfig: {
          source: _.filter(config.paths.watched, path => fs.existsSync(path)),
          destination: `${config.paths.public}/styleguide`,
        },
      };
    }
    this.config = _.defaultsDeep(config.plugins.kss || {}, sourceDestination, DEFAULT_OPTIONS);

    const kssConfig = this.config.kssConfig || [];
    this.css = kssConfig.css || [];
    this.js = kssConfig.js || [];
  }

  /**
   * Brunch Hook after everything has compiled.
   */
  onCompile(files) {
    console.log('Generating living styleguide');
    const actualConfig = _.cloneDeep(this.config.kssConfig);

    if (this.config.addCssFiles) {
      const cssFiles = _(files)
        .filter(file => file.type === 'stylesheet')
        .map(sf => sf.path.replace(`${this.brunchConfig.paths.public}/`, ''))
        .value();
      this.css = _.uniq([].concat(this.css, cssFiles));
    }
    if (this.config.addJsFiles) {
      const jsFiles = _(files)
        .filter(file => file.type === 'javascript')
        .map(sf => sf.path.replace(`${this.brunchConfig.paths.public}/`, ''))
        .value();
      this.js = _.uniq([].concat(this.js, jsFiles));
    }

    actualConfig.css = this.css;
    actualConfig.js = this.js;
    return kss(actualConfig);
  }
}

KssPlugin.prototype.brunchPlugin = true;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// KssPlugin.prototype.defaultEnv = 'production';

module.exports = KssPlugin;
