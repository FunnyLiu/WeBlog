var workbox = (function() {
  "use strict";
  try {
    self.workbox.v["workbox:sw:3.6.3"] = 1;
  } catch (t) {}
  const t = "https://storage.googleapis.com/workbox-cdn/releases/3.6.3",
    e = {
      backgroundSync: "background-sync",
      broadcastUpdate: "broadcast-cache-update",
      cacheableResponse: "cacheable-response",
      core: "core",
      expiration: "cache-expiration",
      googleAnalytics: "google-analytics",
      navigationPreload: "navigation-preload",
      precaching: "precaching",
      rangeRequests: "range-requests",
      routing: "routing",
      strategies: "strategies",
      streams: "streams"
    };
  return new class {
    constructor() {
      return (
        (this.v = {}),
        (this.t = {
          debug: "localhost" === self.location.hostname,
          modulePathPrefix: null,
          modulePathCb: null
        }),
        (this.e = this.t.debug ? "dev" : "prod"),
        (this.s = !1),
        //Proxy 语法 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        new Proxy(this, {
          get(t, s) {
            //如果workbox对象上不存在指定对象，就依赖注入该对象对应的脚本
            if (t[s]) return t[s];
            const o = e[s];
            return o && t.loadModule(`workbox-${o}`), t[s];
          }
        })
      );
    }
    /**
     * 设置一些配置变量
     * @param {Object} t 
     */
    setConfig(t = {}) {
      if (this.s)
        throw new Error(
          "Config must be set before accessing workbox.* modules"
        );
      Object.assign(this.t, t), (this.e = this.t.debug ? "dev" : "prod");
    }
    /**
     * 监听，安装后直接跳过等待时间，进入激活状态
     */
    skipWaiting() {
      self.addEventListener("install", () => self.skipWaiting());
    }
    /**
     * 监听，激活后直接保证客户端的serviceworker被接管
     */
    clientsClaim() {
      self.addEventListener("activate", () => self.clients.claim());
    }
    /**
     * 加载前端模块
     * @param {Strnig} t 
     */
    loadModule(t) {
      const e = this.o(t);
      try {
        importScripts(e), (this.s = !0);
      } catch (s) {
        throw (console.error(`Unable to import module '${t}' from '${e}'.`), s);
      }
    }
    /**
     * 用于加载测试或线上路径，相对路径等
     * @param {String} e 
     */
    o(e) {
      if (this.t.modulePathCb) return this.t.modulePathCb(e, this.t.debug);
      let s = [t];
      const o = `${e}.${this.e}.js`,
        r = this.t.modulePathPrefix;
      return (
        r &&
          "" === (s = r.split("/"))[s.length - 1] &&
          s.splice(s.length - 1, 1),
        s.push(o),
        s.join("/")
      );
    }
  }();
})();

//# sourceMappingURL=workbox-sw.js.map
