/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts(
    "https://edu-cms.nosdn.127.net/topics/js/edu-ws_4b893c5d5d1631c9b8ec1585974f4f24.js"
);

if (workbox) {
    console.log('workbox加载成功');
} else {
    console.log('workbox加载失败');
}

//我们的nos资源不能跨域,所以不能用改方法
var fileList = [
    //{
    //    url:'https://edu-cms.nosdn.127.net/topics/css/cms_specialWebCommonStyle_cf01670edc575f0121f75e6c7f7ec1e6.css'
    //},
    //{
    //    url:'https://edu-cms.nosdn.127.net/topics/js/cms_regular_76c69a11a888b7f7c728f6feb2e87831.js'
    //},
    //{
    //    url:'https://edu-cms.nosdn.127.net/topics/js/cms_wap_1a36f5fe9c15c63f84ac89103ecc6bcc.js'
    //},
    //{
    //    url:'https://edu-cms.nosdn.127.net/topics/js/cms_specialWebCommon_js_f26c710bd7cd055a64b67456192ed32a.js'
    //},
    {
        url:'https://static.ws.126.net/163/frontend/share/css/article.207ac19ad70fd0e54d4a.css'
    }
];




//关闭控制台中的输出
workbox.setConfig({ debug: false });

//更新
workbox.skipWaiting();
workbox.clientsClaim();


//设置缓存cachestorage的名称
workbox.core.setCacheNameDetails({
    prefix:'edu-cms',
    suffix:'v1'
});

//precache 适用于支持跨域的cdn和域内静态资源
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(fileList, {
    "ignoreUrlParametersMatching": [/./]
});





// 完整的带完整 host 的 URL 路径，这里的 URL 必须是 https 的
workbox.routing.registerRoute(
    new RegExp('https?:\/\/edu-cms\.nosdn\.127\.net\/topics.*(\.js|\.css)'),
    workbox.strategies.staleWhileRevalidate({
        //cdn 资源的正确处理方式,在fetch api中,Opaque Responses的状态永远为0,而cacheapi中只接受状态为2**的,所有需要通过
        //const request = new Request('https://third-party-no-cors.com/', {mode: 'no-cors'});
        //fetch(request).then(response => cache.put(request, response));
        //类似上面方式来hack
        cacheableResponse: {
            statuses: [0, 200], // Make sure 0 is included in this list.
        }
    })
);

//图片缓存,单独的名字
workbox.routing.registerRoute(
    new RegExp('https?:\/\/edu-image\.nosdn\.127\.net\/.*'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'edu-image-cache',
        //使用插件
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ]
    })
);


