// 引入node-fetch模块
const fetch = require("node-fetch");

// 定义请求的URL和选项
const url = "https://admin-test.woffie.cn/front-api/sys/dict/modify";
const options = (item) => {
  return {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      "sec-ch-ua":
        '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: "ATSESSIONID=3596a82b-4108-41da-af71-fc141a24398f",
      Referer: "https://admin-test.woffie.cn/sys/dict",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: JSON.stringify(item),
    method: "POST",
  };
};
const list = [
  {
    sortedNum: 1,
    code: "GENERAL_DEFAULT_DEPOSIT",
    name: null,
    nameEnus: "Default deposit",
    nameZhcn: "默认保证金",
    nameZhtw: "默認保证金",
    parent: "GENERAL",
    vals: "0.01",
    remarks: null,
  },
];
list.forEach((item) => {
  // 发送请求并处理响应
  fetch(url, options(item))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
