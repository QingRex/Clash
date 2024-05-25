// capture_cookie.js
// 这个脚本用于捕获Cookies并将其持久化存储

// 定义捕获Cookies的URL模式
const urlPattern = /^http:\/\/cwsf\.whut\.edu\.cn\//;

function storeCookies(cookies) {
    if (cookies) {
        const success = $persistentStore.write(cookies, 'DianFee');
        if (success) {
            $notification.post('捕获Cookies', '成功', 'Cookies已成功存储或更新。');
        } else {
            $notification.post('捕获Cookies失败', '错误', '存储Cookies失败，请检查脚本并重试。');
        }
    } else {
        $notification.post('未找到Cookies', '警告', '在请求中未找到Cookies。');
    }
}

if (urlPattern.test($request.url)) {
    const cookies = $request.headers['Cookie'] || '';
    console.log(`捕获的Cookies: ${cookies}`);
    storeCookies(cookies);
}


$done();
