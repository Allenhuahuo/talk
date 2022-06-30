//单对象模式，只污染一次全局变量
//注意：const 定义的变量不会污染windows

const API = (function() {
    const HOST = "https://study.duyiedu.com";
    const TOKEN = "token";
    // 封装post和get
    function get(path) {
        path = HOST + path;
        const headers = {};
        const token = localStorage.getItem(TOKEN);
        console.log(token);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(path, { method: "GET", headers });
    }

    function post(path, data) {
        path = HOST + path;
        const headers = {
            "Content-Type": "application/json", //这里不会自动补全，要手动书写
        };
        const token = localStorage.getItem(TOKEN);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(path, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
    }

    // 注册
    async function reg(userInfo) {
        return await post("/api/user/reg", userInfo).then((result) =>
            result.json()
        ); // fetch会返回一个Promise，该Promise会在接收完响应头后变为fulfilled
    }

    // 登录
    async function login(loginInfo) {
        const resp = await post("/api/user/login", loginInfo);
        const result = await resp.json(); //获得响应体
        //要将响应头中的令牌保存起来（保存到本地中）
        if (result.code == 0) {
            const token = resp.headers.get("authorization");
            console.log(token);
            localStorage.setItem("token", token);
        }
        return await result;
    }

    // 验证账号是否存在
    async function exists(id) {
        const result = await get(`/api/user/exists?loginId=${id}`);
        return await result.json();
    }

    // 当前用户的信息
    async function nowUser() {
        return await get("/api/user/profile").then((result) => result.json());
    }

    // 发送聊天信息
    async function sendChat(content) {
        return await post("/api/chat", content).then((result) => result.json());
    }

    // 获取聊天记录
    async function getHistory() {
        return await get("/api/chat/history").then((result) => result.json());
    }

    //退出登录
    function loginOut() {
        localStorage.removeItem(TOKEN);
    }

    return {
        reg,
        login,
        exists,
        nowUser,
        sendChat,
        getHistory,
        loginOut,
    };
})();