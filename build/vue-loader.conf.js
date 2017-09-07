var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
var  px2rem = require('postcss-px2rem')
// 自动转rem配置，如果设计图是750，则写75，如果为375，则为37.5，以此类推
let  px2remConfig={remUnit:75,remPrecision:8};
let  postcssOptions=[px2rem(px2remConfig)];
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  postcss:postcssOptions,
}
