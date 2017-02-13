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
      this.css = this.handleGeneratedFiles('stylesheet', files, this.css);
    }
    if (this.config.addJsFiles) {
      this.js = this.handleGeneratedFiles('javascript', files, this.js);
    }

    actualConfig.css = this.css;
    actualConfig.js = this.js;
    return kss(actualConfig);
  }

  /**
   * Expects a bunch of files
   */
  handleGeneratedFiles(type, generatedFiles, existingFiles) {
    const changed = _(generatedFiles)
      // find all generated files of certain type
      .filter(file => file.type === type)
      // remove any prefixing public path
      .map(file => file.path.replace(`${this.brunchConfig.paths.public}/`, ''))
      .value();
    return _(existingFiles)
      // merge with existing files
      .concat(changed)
      .uniq()
      // keep only those that do exist
      .filter(path => fs.existsSync(`${this.brunchConfig.paths.public}/${path}`))
      .value();
  }
}

KssPlugin.prototype.brunchPlugin = true;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// KssPlugin.prototype.defaultEnv = 'production';

module.exports = KssPlugin;
