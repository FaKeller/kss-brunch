'use strict';

let kss = require('kss'),
    _ = require('lodash'),
    fs = require('fs');

const DEFAULT_OPTIONS = {
    /** include generated CSS files in the KSS styleguide */
    addCssFiles: true,
    /** include generated CSS files in the KSS styleguide */
    addJsFiles: true,

    /** options that are passed to kss-node */
    kssConfig: {}
};

class KssPlugin {

    constructor(config) {
        this.brunchConfig = config;
        this.kssConfig = _.defaultsDeep(
            config.plugins.kss || {},
            {
                kssConfig: {
                    source: _.filter(this.brunchConfig.paths.watched, path => fs.existsSync(path)),
                    destination: `${this.brunchConfig.paths.public}/styleguide`
                }
            },
            DEFAULT_OPTIONS
        );
    }

    /**
     * Brunch Hook after everything has compiled.
     */
    onCompile(files) {
        console.log("Generating living styleguide");
        let actualConfig = _.cloneDeep(this.kssConfig.kssConfig);

        if (this.kssConfig.addCssFiles) {
            let cssFiles = _(files)
                .filter(file => file.type == 'stylesheet')
                .map(sf => sf.path)
                .value();
            actualConfig.css = (actualConfig.css || []).concat(cssFiles);
        }
        if (this.kssConfig.addJsFiles) {
            let jsFiles = _(files)
                .filter(file => file.type == 'javascript')
                .map(sf => sf.path)
                .value();
            actualConfig.js = (actualConfig.js || []).concat(jsFiles);
        }

        return kss(actualConfig);
    }
}

KssPlugin.prototype.brunchPlugin = true;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// KssPlugin.prototype.defaultEnv = 'production';

module.exports = KssPlugin;