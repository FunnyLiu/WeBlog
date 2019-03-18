# webpack 相关 demo

启动
npm run start01

打包
npm run build01

## 入口文件 demo01_entry

```javascript
module.exports = {
  entry: "./main.js",
  output: {
    filename: "./bundle.js"
  }
};
```

## 多入口文件 demo02_multiEntry

```javascript
module.exports = {
  entry: {
    bundle1: "./main1.js",
    bundle2: "./main2.js"
  },
  output: {
    filename: "[name].js"
  }
};
```

## babel-loader 引入 jsx demo03_babelLoader

```javascript
module.exports = {
  entry: "./main.jsx",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      }
    ]
  }
};
```

## cssloader demo04cssLoader

cssloader 用来解析 require 的 css 文件，而 style-loader 用来将样式通过 style 的方式加入 html

```javascript
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

## urlloader demo05_imageLoader

urlloader 用于解析 require 进的图片类型。

```javascript
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};
```

## cssmodule demo06_cssModule

css 模块化引入

main.jsx

```javascript
var React = require("react");
var ReactDOM = require("react-dom");
//模块化的css，引入并使用
var style = require("./app.css");

ReactDOM.render(
  <div>
    <h1 className={style.h1}>Hello World</h1>
    <h2 className="h2">Hello Webpack</h2>
  </div>,
  document.getElementById("example")
);
```

app.css

```css
.h1 {
  color: red;
}

/* 全局通用的需要额外标识 */
:global(.h2) {
  color: blue;
}
```

webpack.config.js

```javascript
module.exports = {
  entry: "./main.jsx",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};
```

## uglifyJS demo07_uglify

使用 uglify 插件编译 js

```javascript
var webpack = require("webpack");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  plugins: [new UglifyJsPlugin()]
};
```

## 打包 html demo08_browser

通过 html-webpack-plugin 将 html 进行打包出来，通过 open-browser-webpack-plugin 在启动 webpack 时新开浏览器。

```javascript
var HtmlwebpackPlugin = require("html-webpack-plugin");
var OpenBrowserPlugin = require("open-browser-webpack-plugin");

module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: "Webpack-demos",
      filename: "index.html"
    }),
    new OpenBrowserPlugin({
      url: "http://localhost:8081"
    })
  ]
};
```

## 环境变量 demo09_environmentFlag

通过 cross-env，在启动时设置环境变量，在代码层通过环境变量控制逻辑

package.json

```json
{
  "start09": "cd demo09_environmentFlag && cross-env DEBUG=true node server"
}
```

main.js

```javascript
document.write("<h1>Hello World</h1>");

//环境标识
if (__DEV__) {
  document.write(new Date());
}
```

webpack.config.js

```javascript
var webpack = require("webpack");

//定义一个webpack插件，传递字符串__DEV__
var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
});

module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  plugins: [devFlagPlugin]
};
```

## 动态加载 demo10_dynamicImport

通过 require.ensure 或 import，根据用户交互行为，动态加载模块 bundle。

main.js

```javascript
let ensureNode = document.querySelector("#j-ensure");
let importNode = document.querySelector("#j-import");
ensureNode.addEventListener(
  "click",
  () => {
    //通过requie.ensure来动态加载其他js文件
    require.ensure(["./a"], function(require) {
      var content = require("./a");
      //异步加载的js
      document.open();
      document.write("<h1>" + content + "</h1>");
      document.close();
    });
  },
  false
);

importNode.addEventListener(
  "click",
  () => {
    //通过import的方式调用热加载，指定webpackChunkName后加载文件从0.bundle.js变为a.bundle.js
    //import为promise的方式
    return import(/* webpackChunkName: "a" */ "./a")
      .then(({ default: _ }) => {
        //异步加载的js
        document.open();
        document.write("<h1>" + _ + "</h1>");
        document.close();
      })
      .catch(error => "An error occurred while loading the conntent");
  },
  false
);
```

webpack.config.js

```javascript
module.exports = {
  mode: "development",
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  }
};
```

---

## bundleLoader 来动态引入 demo11_bundleLoader

使用 bundleLoader 来动态引入文件

main.js

```javascript
import bundle from "./a.bundle.js";

let loaderNode = document.querySelector("#j-loader");
loaderNode.addEventListener(
  "click",
  () => {
    bundle(file => {
      document.open();
      document.write("<h1>" + file + "</h1>");
      document.close();
    });
  },
  false
);
```

webpack.config.js

```javascript
module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: {
          loader: "bundle-loader",
          options: {
            lazy: true
          }
        }
      }
    ]
  }
};
```

---

## 公共 chunk demo12_commonChunk

使用 splitChunks 的方式，配置在多入口 entry 中的文件，共同依赖项抽出。

```javascript
module.exports = {
  entry: {
    bundle1: "./main1.jsx",
    bundle2: "./main2.jsx"
  },
  output: {
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  }
};
```

---

## 全局别名 demo13_externals

通过 externals 给第三方库挂载在全局的别名进行映射。

main.js

```javascript
import $ from "jquery";

$("#j-dom").show();
```

webpack.config.js

```javascript
module.exports = {
  mode: "development",
  entry: "./main.js",
  output: {
    filename: "bundle.js"
  },
  //全局变量映射，import 时的 from 会查找
  externals: {
    jquery: "jQuery"
  }
};
```

---

## 带 hash 的 chunk demo14_chunkHash

生成文件名使用hash的方式

```javascript
var path = require("path");
module.exports = {
  entry: {
    main: "./main.js"
  },
  optimization: {
    runtimeChunk: true
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  }
};
```

---

## 热更新 by eppress 中间件 demo15_HMR_express
使用express的中间件webpack-hot-middleware，来实现热更新

main1.js
``` javascript
import css from './app.css';
console.warn('this is console1');
if (module.hot) {
    module.hot.accept();
}
```

webpack.config.js

``` javascript
const  webpack = require('webpack') 

module.exports = {
  entry: {
    bundle1: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000','./main1.js'],
    bundle2: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000','./main2.js']
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
};

```

启动的server.js
``` javascript

    
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require(`./webpack.config`)

const app = express()
const compiler = webpack(WebpackConfig)


app.use(webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false
  }
}))

//启用模块热更新
app.use(webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));

app.use(express.static(__dirname))

const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

```

---

## 热更新 by webpack-dev-server cli demo16_HMR_cli

不需要啥额外的配置，只需要启动server时设置一定的参数就好了。

package.json
``` json
    "start16": "cd demo16_HMR_cli && webpack-dev-server --inline --watch --hot",
```

main.js
``` javascript
    "start16": "cd demo16_HMR_cli && webpack-dev-server --inline --watch --hot",
```

webpack.config.js
``` javascript

module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ]
  }
};

```

---

## 热更新 by webpack-dev-server api demo17_HMR_api
还是通过webpack-dev-server,但是不是cli而是api，来启用热更新

main1.js
``` javascript
import css from './app.css';
console.warn('this is console2');
if (module.hot) {
    module.hot.accept();
}
```

server.js
``` javascript

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
    hot: true,
    host: 'localhost',
    stats: {
        colors: true
    }
};
//设置配置
webpackDevServer.addDevServerEntrypoints(config, options);

var compiler = webpack(config);
var server = new webpackDevServer(compiler, options);

server.listen(8081, 'localhost', () => {
    console.log('dev server listening on port 8081');
});
```