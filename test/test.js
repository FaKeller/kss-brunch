'use strict';

const expect = require('chai').expect,
    proxyquire = require('proxyquire'),
    _ = require('lodash'),
    kssStub = (cfg) => Promise.resolve(cfg),
    fsStub = {existsSync: () => true},
    KssPlugin = proxyquire('../src', {
        'kss': kssStub,
        'fs': fsStub
    });

describe('KssPlugin', () => {

    const TEST_PLUGIN_DEFAULT_OPTIONS = {
        paths: {
            watched: ['app', 'test', 'vendor'],
            public: 'public'
        },
        plugins: {}
    };

    let gJS = (path) => {
        return {
            type: 'javascript',
            path: path
        }
    }, gCSS = (path) => {
        return {
            type: 'stylesheet',
            path: path
        }
    };

    it("should create the plugin without any options", () => {
        const plugin = new KssPlugin();
        expect(plugin).to.be.an.instanceof(KssPlugin);
        expect(plugin).to.respondTo('onCompile');
    });

    it("should properly trigger kss from a default brunch config", () => {
        const plugin = new KssPlugin(TEST_PLUGIN_DEFAULT_OPTIONS);

        const expected = {
            css: [],
            js: [],
            destination: "public/styleguide",
            source: ['app', 'test', 'vendor']
        };
        return plugin.onCompile([]).then(kssConfig => {
            expect(kssConfig).to.eql(expected);
        });
    });

    it("should automatically add generated JS/CSS files to kss config", () => {
        const plugin = new KssPlugin(TEST_PLUGIN_DEFAULT_OPTIONS);

        const generatedFiles = [gJS('one.js'), gCSS('one.css'), gJS('two.js')];
        return plugin.onCompile(generatedFiles).then(kssConfig => {
            expect(kssConfig.css).to.eql(['one.css']);
            expect(kssConfig.js).to.eql(['one.js', 'two.js']);
        });
    });

    it("should skip adding generated JS/CSS files to kss config if plugin config options are set to false", () => {
        const plugin = new KssPlugin(_.defaultsDeep({
            plugins: {
                kss: {
                    addCssFiles: false,
                    addJsFiles: false
                }
            }
        }, TEST_PLUGIN_DEFAULT_OPTIONS));

        const generatedFiles = [gJS('one.js'), gCSS('one.css'), gJS('two.js')];
        return plugin.onCompile(generatedFiles).then(kssConfig => {
            expect(kssConfig.css).to.be.empty;
            expect(kssConfig.js).to.be.empty;
        });
    });

    it("should add generated CSS/JS files to files configured in kssConfig options", () => {
        const plugin = new KssPlugin(_.defaultsDeep({
            plugins: {
                kss: {
                    kssConfig: {
                        js: ['config.js'],
                        css: ['config.css']
                    }
                }
            }
        }, TEST_PLUGIN_DEFAULT_OPTIONS));

        const generatedFiles = [gJS('one.js'), gCSS('one.css'), gJS('two.js')];
        return plugin.onCompile(generatedFiles).then(kssConfig => {
            expect(kssConfig.css).to.eql(['config.css', 'one.css']);
            expect(kssConfig.js).to.eql(['config.js', 'one.js', 'two.js']);
        });
    });

    it("should pass kssConfig options to kss", () => {
        const plugin = new KssPlugin(_.defaultsDeep({
            plugins: {
                kss: {
                    kssConfig: {
                        "homepage": "styleguide.md"
                    }
                }
            }
        }, TEST_PLUGIN_DEFAULT_OPTIONS));

        const generatedFiles = [gJS('one.js'), gCSS('one.css'), gJS('two.js')];
        return plugin.onCompile(generatedFiles).then(kssConfig => {
            expect(kssConfig.homepage).to.equal("styleguide.md");
        });
    });
});