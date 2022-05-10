const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');

// 拼接路径
function resolve(dir) {
    return path.join(__dirname, dir);
}

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss');

let baseUrl = process.env.BASE_URL || '/';

// 定义 externals
const externals = {};

// 这里引入库的cdn 文件
const cdn = {
    // 开发环境
    dev: {
        css: [],
        js: []
    },
    // 生产环境
    build: {
        css: [
            // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
            // 'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
        ],
        js: [
            // 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
            // 'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
            // 'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
            // 'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
            // 'https://unpkg.com/element-ui/lib/index.js',
            // 'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
            // 'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
        ]
    }
};

const proxy =
    process.env.VUE_APP_CROSS === 'yes' ?
    '' : {
        [process.env.VUE_APP_API]: {
            target: process.env.VUE_APP_HOST,
            changeOrigin: false,
            ws: true
        }
    };
module.exports = {
    baseUrl: baseUrl, // 根据你的实际情况更改这里
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint#configuration
    lintOnSave: true,
    outputDir: 'sgw',
    devServer: {
        // 和 baseUrl 保持一致
        publicPath: baseUrl,
        overlay: {
            warnings: true,
            errors: true
        },
        port: process.env.DEV_PORT || 9000,
        proxy,
        open: false,
        quiet: false
    },
    css: {
        loaderOptions: {
            // 设置 scss 公用变量文件
            sass: {
                data: `@import '~@/assets/style/public.scss';`
            }
        }
    },
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
        config.plugins.delete('prefetch').delete('preload');
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve.symlinks(true);
        config
            // 开发环境
            .when(
                process.env.NODE_ENV === 'development',
                // sourcemap不包含列信息
                config => config.devtool('cheap-source-map')
            )
            // 非开发环境
            .when(process.env.NODE_ENV !== 'development', config => {
                config.optimization.minimizer([
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            // 移除 console
                            // 其它优化选项 https://segmentfault.com/a/1190000010874406
                            compress: {
                                // warnings: false,
                                drop_console: true,
                                drop_debugger: true,
                                pure_funcs: ['console.log']
                            }
                        }
                    })
                ]);
            });

        /**
         * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
         */
        config.plugin('html').tap(args => {
            if (process.env.NODE_ENV === 'production') {
                args[0].cdn = cdn.build;
            }
            if (process.env.NODE_ENV === 'development') {
                args[0].cdn = cdn.dev;
            }
            return args;
        });

        // markdown
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('text-loader')
            .loader('text-loader')
            .end();
        // i18n
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end();
        // svg
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule.include
            .add(resolve('src/assets/svg-icons/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'mgsgw-[name]'
            })
            .end();
        // image exclude
        const imagesRule = config.module.rule('images');
        imagesRule
            .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
            .exclude.add(resolve('src/assets/svg-icons/icons'))
            .end();
        // 重新设置 alias
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@common', resolve('src/common'));
        // node
        config.node.set('__dirname', true).set('__filename', true);
        // babel-polyfill 加入 entry
        const entry = config.entry('app');
        entry.add('babel-polyfill').end();
        // 判断环境加入模拟数据
        if (process.env.VUE_APP_BUILD_MODE === 'mock') {
            entry.add('@/mock').end();
        }
    },
    // 修改webpack config, 使其不打包externals下的资源
    configureWebpack: config => {
        const myConfig = {};
        if (process.env.NODE_ENV === 'production') {
            // 1. 生产环境npm包转CDN
            myConfig.externals = externals;

            // gzip压缩配置 当前压缩文件 js css
            myConfig.plugins = [];
            myConfig.plugins.push(
                new CompressionWebpackPlugin({
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 8192,
                    minRatio: 0.8
                })
            );
        }
        return myConfig;
    }
};
