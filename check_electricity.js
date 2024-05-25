// check_electricity.js
// 这个脚本每小时执行一次，用于查询电费余额

// 定义请求的URL
const url = "http://cwsf.whut.edu.cn/MNetWorkUI/queryReserve";

// 从持久化存储中读取Cookies
const cookies = $persistentStore.read('DianFee');

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

    // 发送POST请求
    $httpClient.post(requestOptions, (error, response, data) => {
        if (error) {
            // 请求错误时发送通知
            $notification.post('电费查询失败', '请求错误', '请检查网络或稍后重试。');
        } else if (response.status === 200) {
            try {
                // 解析响应数据
                const responseData = JSON.parse(data);
                const meterOverdue = responseData.meterOverdue;

                // 检查电费余额
                if (meterOverdue < 30) {
                    $notification.post('电费余额不足', '当前电费余额: ' + meterOverdue + '元', '请尽快充值以避免停电。');
                } else {
                    $notification.post('电费查询成功', '当前电费余额: ' + meterOverdue + '元', '您的电费余额充足。');
                }
            } catch (e) {
                // 解析错误时发送通知
                $notification.post('电费查询失败', '解析错误', '响应数据解析失败，请稍后重试。');
            }
        } else {
            // 请求失败时发送通知
            $notification.post('电费查询失败', '请求失败', 'HTTP状态码: ' + response.status);
        }
    });
} else {
    // 没有找到Cookies时发送通知
    $notification.post('电费查询失败', '缺少Cookies', '请先登录以获取Cookies。');
}

// 结束脚本
$done();
