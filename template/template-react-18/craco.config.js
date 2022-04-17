const CracoLessPlugin = require('craco-less')
const CracoAliasPlugins = require('craco-alias')
// const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {},
                        javascriptEnabled: true,
                    },
                },
            },
        },
        {
            plugin: CracoAliasPlugins,
            options: {
                source: 'tsconfig',
                tsConfigPath: 'tsconfig.paths.json',
            },
        },
    ],
}
