importScripts(
    "https://edu-cms.nosdn.127.net/topics/js/workbox_9cc4c3d662a4266fe6691d0d5d83f4dc.js"
);

if (workbox) {
    console.log('workbox加载成功');
} else {
    console.log('workbox加载失败');
}

//更新
workbox.skipWaiting();
workbox.clientsClaim();

var cacheList = [
    '/Hexo/public/demo/PWADemo/workbox/index.html'
];
workbox.routing.registerRoute(
    function(event) {
        // 需要缓存的HTML路径列表
        if (event.url.host === 'localhost:63342') {
            if (~cacheList.indexOf(event.url.pathname)) return true;
            else return false;
        } else {
            return false;
        }
    },
    workbox.strategies.networkFirst({
        cacheName: 'lf-sw:html',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 10
            })
        ]
    })
);

//缓存静态资源
workbox.routing.registerRoute(
    new RegExp('https://edu-cms\.nosdn\.127\.net/topics/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'lf-sw:static',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30
            })
        ]
    })
);

//缓存静态资源
workbox.routing.registerRoute(
    new RegExp('main.css'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'lf-sw:static',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30
            })
        ]
    })
);


//缓存图片
workbox.routing.registerRoute(
    new RegExp('https://edu-image\.nosdn\.127\.net/'),
    workbox.strategies.cacheFirst({
        cacheName: 'lf-sw:img',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 40,
                maxAgeSeconds: 12 * 60 * 60
            })
        ]
    })
);
workbox.routing.registerRoute(
    new RegExp('logo_48.png'),
    workbox.strategies.cacheFirst({
        cacheName: 'lf-sw:img',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 40,
                maxAgeSeconds: 12 * 60 * 60
            })
        ]
    })
);