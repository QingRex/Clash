// check_electricity.js
// 这个脚本每小时执行一次，用于查询电费余额

// 定义请求的URL
const url = "http://cwsf.whut.edu.cn/MNetWorkUI/queryReserve";

// 从持久化存储中读取Cookies
const cookies = $persistentStore.read('DianFee');

// 打印日志：读取到的Cookies
console.log("读取到的Cookies: " + cookies);

if (cookies) {
    // 定义POST请求的选项
    const requestOptions = {
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies
        },
        body: 'meterId=0311.008947.1&factorycode=E035',
        timeout: 5
    };

    // 打印日志：请求选项
    console.log("请求选项: " + JSON.stringify(requestOptions));

    // 发送POST请求
    $httpClient.post(requestOptions, function(error, response, data) {
        if (error) {
            // 请求错误时发送通知并打印日志
            console.log("请求错误: " + JSON.stringify(error));
            $notification.post('电费查询失败', '请求错误', '请检查网络或稍后重试。');
        } else {
            // 打印日志：响应状态码和响应数据
            console.log("响应状态码: " + response.status);
            console.log("响应数据: " + data);

            if (response.status === 200) {
                try {
                    // 解析响应数据
                    const responseData = JSON.parse(data);
                    const meterOverdue = responseData.meterOverdue;

                    // 打印日志：解析后的响应数据
                    console.log("解析后的响应数据: " + JSON.stringify(responseData));

                    // 检查电费余额
                    if (meterOverdue < 30) {
                        $notification.post('电费余额不足', '当前电费余额: ' + meterOverdue + '元', '请尽快充值以避免停电。');
                    } else {
                        $notification.post('电费查询成功', '当前电费余额: ' + meterOverdue + '元', '您的电费余额充足。');
                    }
                } catch (e) {
                    // 解析错误时发送通知并打印日志
                    console.log("解析错误: " + JSON.stringify(e));
                    $notification.post('电费查询失败', '解析错误', '响应数据解析失败，请稍后重试。');
                }
            } else {
                // 请求失败时发送通知并打印日志
                console.log("请求失败，HTTP状态码: " + response.status);
                $notification.post('电费查询失败', '请求失败', 'HTTP状态码: ' + response.status);
            }
        }
        // 结束脚本
        $done();
    });
} else {
    // 没有找到Cookies时发送通知并打印日志
    console.log("未找到Cookies");
    $notification.post('电费查询失败', '缺少Cookies', '请先登录以获取Cookies。');
    // 结束脚本
    $done();
}

