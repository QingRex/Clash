// capture_cookie.js
// 这个脚本用于捕获指定域名的Cookies并将其持久化存储

// 定义捕获Cookies的URL模式
const urlPattern = /^http:\/\/cwsf\.whut\.edu\.cn\//;

// 存储Cookies并处理错误的函数
function storeCookies(cookies) {
    if (cookies) {
        // 尝试存储Cookies
        const success = $persistentStore.write(cookies, 'DianFee');
        if (success) {
            // 如果存储成功，发送成功通知
            $notification.post('捕获Cookies', '成功', 'Cookies已成功存储或更新。');
        } else {
            // 如果存储失败，发送失败通知
            $notification.post('捕获Cookies失败', '错误', '存储Cookies失败，请检查脚本并重试。');
        }
    } else {
        // 如果没有找到Cookies，发送警告通知
        $notification.post('未找到Cookies', '警告', '在请求中未找到Cookies。');
    }
}

// 检查请求URL是否符合模式
if (urlPattern.test($request.url)) {
    // 从请求头中提取Cookies
    const cookies = $request.headers['Cookie'] || '';

    // 打印捕获的Cookies以便调试
    console.log(`捕获的Cookies: ${cookies}`);

    // 调用函数持久化存储Cookies并处理错误
    storeCookies(cookies);
}

// 继续处理请求
$done();
