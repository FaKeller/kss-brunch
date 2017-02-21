'use strict';

const kss = require('kss'),
  _ = require('lodash'),
  fs = require('fs');

const DEFAULT_OPTIONS = {
  /** True (default) to turn on styleguide generation. */
  enabled: true,
  /** the name of the folder to write the styleguide to */
  styleguideFolder: 'styleguide',

  /** include generated CSS files in the KSS styleguide */
  addCssFiles: true,
  /** include generated CSS files in the KSS styleguide */
  addJsFiles: true,

  /** options that are passed to kss-node */
  kssConfig: {},
};

class KssPlugin {

  constructor(brunchConfig) {
    brunchConfig = brunchConfig || {plugins: {kss: {}}};
    this.brunchConfig = brunchConfig;
    this.config = _.defaultsDeep(brunchConfig.plugins.kss || {}, DEFAULT_OPTIONS);

    let sourceDestination;
    if (_.isNil(brunchConfig.paths)) {
      sourceDestination = {};
    } else {
      sourceDestination = {
        source: _.filter(brunchConfig.paths.watched, path => fs.existsSync(path)),
        destination: `${brunchConfig.paths.public}/${this.config.styleguideFolder}`,
      };
    }

    this.kssConfig = _.defaults(this.config.kssConfig || {}, sourceDestination);
    this.css = this.kssConfig.css || [];
    this.js = this.kssConfig.js || [];
  }

  /**
   * Brunch Hook after everything has compiled.
   */
  onCompile(files) {
    if (!this.config.enabled) {
      return;
    }
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
      .map(file => file.path.replace(`${this.brunchConfig.paths.public}/`, '/'))
      .value();
    return _(existingFiles)
      // merge with existing files
      .concat(changed)
      .uniq()
      // keep only those that do exist
      .filter(path => fs.existsSync(`${this.brunchConfig.paths.public}/${path}`))
      .map(path => '/' + path.replace(/^\/+/, ''))
      .value();
  }
}

KssPlugin.prototype.brunchPlugin = true;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// KssPlugin.prototype.defaultEnv = 'production';

module.exports = KssPlugin;
