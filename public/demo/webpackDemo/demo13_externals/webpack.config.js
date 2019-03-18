module.exports = {
    mode:'development',
    entry: './main.js',
    output: {
      filename: 'bundle.js'
    },
    //全局变量映射，import 时的 from 会查找
    externals: {
        jquery: 'jQuery'
    }
  };
  