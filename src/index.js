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
                .map(sf => sf.path)
                .value();
            actualConfig.css = (actualConfig.css || []).concat(cssFiles);
        }
        if (this.config.addJsFiles) {
            const jsFiles = _(files)
                .filter(file => file.type === 'javascript')
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
