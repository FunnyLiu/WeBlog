importScripts(
    "https://edscdn.stu.126.net/ykt-static/workbox/3.6.3/workbox-sw.js"
);



if (workbox) {
    console.log('workbox加载成功');
} else {
    console.log('workbox加载失败');
}


//更新
workbox.skipWaiting();
workbox.clientsClaim();

//关闭控制台中的输出
workbox.setConfig({
    debug: false,
    modulePathPrefix: 'https://edscdn.stu.126.net/ykt-static/workbox/3.6.3/'
});
//
//设置缓存cachestorage的名称
workbox.core.setCacheNameDetails({
    prefix:'edu-sw'
});

/**
 * 缓存一般不变的静态资源
 * @type {Array.<*>}
 * @private
 */
self.__precacheManifest = [
    {
        url:'https://edu-cms.nosdn.127.net/topics/css/cms_specialWebCommonStyle_cf01670edc575f0121f75e6c7f7ec1e6.css'
    },
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_regular_76c69a11a888b7f7c728f6feb2e87831.js'
    },
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_flexible_8254ebe28c3ef10de10b5befac286b8c.js'
    },
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_fastclick_a05a9218baea91b7aa01bd6603645600.js'
    },
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_wap_1a36f5fe9c15c63f84ac89103ecc6bcc.js'
    },
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_specialWebCommon_js_f26c710bd7cd055a64b67456192ed32a.js'
    }
].concat(self.__precacheManifest||[]);



//precache 适用于支持跨域的cdn和域内静态资源
workbox.precaching.suppressWarnings();
//永不更改的静态资源
workbox.precaching.precacheAndRoute(self.__precacheManifest,{
    "ignoreUrlParametersMatching": [/./]
});


//缓存html,直接请求,失败了则使用cache


workbox.routing.registerRoute(
    function(event) {
        // 需要缓存的HTML路径列表
        if (event.url.host === 'study.163.com') {
            var reg = new RegExp('/topicsx/');
            if (reg.test(event.url.pathname)) return true;
            else return false;
        } else {
            return false;
        }
    },
    workbox.strategies.networkFirst({
        networkTimeoutSeconds:2,
        cacheName: 'edu-sw:html',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries:1
            })
        ]
    })
);



//缓存静态资源,有cache直接取cache,并同时请求存入cache,没cache则请求
workbox.routing.registerRoute(
    new RegExp('https://edu-cms\.nosdn\.127\.net/topics/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'edu-sw:static',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 4
            })
        ]
    })
);


//缓存图片,直接读cache,没有cache再去请求
//workbox.routing.registerRoute(
//    new RegExp('https://edu-image\.nosdn\.127\.net/'),
//    workbox.strategies.cacheFirst({
//        cacheName: 'edu-sw:img',
//        plugins: [
//            new workbox.cacheableResponse.Plugin({
//                statuses: [0, 200]
//            }),
//            new workbox.expiration.Plugin({
//                maxEntries: 10,
//                maxAgeSeconds: 12 * 60 * 60
//            })
//        ]
//    })
//);

//缓存图片
//workbox.routing.registerRoute(
//    new RegExp('https://img-ph-mirror\.nosdn\.127\.net/'),
//    workbox.strategies.cacheFirst({
//        cacheName: 'edu-sw:img',
//        plugins: [
//            new workbox.cacheableResponse.Plugin({
//                statuses: [0, 200]
//            }),
//            new workbox.expiration.Plugin({
//                maxEntries: 10,
//                maxAgeSeconds: 12 * 60 * 60
//            })
//        ]
//    })
//);