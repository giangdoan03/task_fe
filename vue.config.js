// vue.config.js
const webpack = require("webpack");

module.exports = {
  publicPath: "./", // Đường dẫn tương đối cho tất cả các tài nguyên
  assetsDir: "static", // Đặt thư mục chứa tài nguyên là 'static'
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
    ],
  },
};
