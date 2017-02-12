'use strict';

class KssPlugin {

    constructor(config) {
        // Replace 'plugin' with your plugin's name;
        this.config = config.plugins.kss || {

            };
    }

    /**
     * Brunch Hook after everything has compiled.
     */
    onCompile(files) {
        console.log("Generating living styleguide", files);
    }
}

KssPlugin.prototype.brunchPlugin = true;

// Indicates which environment a plugin should be applied to.
// The default value is '*' for usual plugins and
// 'production' for optimizers.
// KssPlugin.prototype.defaultEnv = 'production';

module.exports = KssPlugin;