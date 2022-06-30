(async() => {
    const result = await API.nowUser();
    const user = result.data;
    // console.log(user);
    const doms = {
        nickname: $("#nickname"),
        loginId: $("#loginId"),
        close: $(".close"),
        "chat-container": $(".chat-container"),
        txt: $("#txtMsg"),
        form: $(".msg-container"),
    };
    // console.log(doms);

    //判断是否登录
    if (!user) {
        console.log(result.code);
        alert("未登录，请先登录");
        location.href = "./login.html";
    }

    //初始化页面信息
    function initUserInfo() {
        doms.nickname.innerText = user.nickname;
        doms.loginId.innerText = user.loginId;
    }

    //注销事件
    doms.close.onclick = () => {
        //删除本地token
        API.loginOut();
        //跳转页面
        location.href = "./login.html";
    };

    //获取历史记录
    /**
     * 将历史记录上传至页面中
     */
    async function toGetHistory() {
        const history = await API.getHistory();
        for (item of history.data) {
            setChat(item);
            // return;
        }
    }

    /**
     * 将传入的数据转化为html结构，并插入到页面中
     * @param {*} data
     */
    function setChat(data) {
        const item = $$$("div");
        console.log(data);
        //给item添加容器
        item.classList.add("chat-item");
        item.classList.add(data.to ? null : "me");
        //图片
        const img = $$$("img");
        img.classList.add("chat-avatar");
        img.src = data.to ? "./asset/robot-avatar.jpg" : "./asset/avatar.png";
        // console.log(img);
        //内容
        const content = $$$("div");
        content.classList.add("chat-content");
        content.innerText = data.content;
        // console.log(content);
        //日期
        const date = getdate(data.createdAt);
        const dateDiv = $$$("div");
        dateDiv.classList.add("chat-date");
        dateDiv.innerText = date;
        // console.log(dateDiv);

        //将它们拼接并表现再页面上
        item.appendChild(img);
        item.appendChild(content);
        item.appendChild(dateDiv);
        doms["chat-container"].appendChild(item);
        // console.log(item);

        //将滚动条移到最下面
        doms["chat-container"].scrollTop = doms["chat-container"].scrollHeight;
    }

    /**
     * 传入时间戳，返回一个符合要求的时间字符串
     * @param {*} data
     */
    function getdate(data) {
        data = new Date(data);
        const year = data.getFullYear();
        const month = (data.getMonth() + 1).toString().padStart(2, "0");
        const day = data.getDate().toString().padStart(2, "0");
        const hours = data.getHours().toString().padStart(2, "0");
        const minutes = data.getMinutes().toString().padStart(2, "0");
        const seconds = data.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    //聊天功能
    /**
     * 设置聊天功能
     */
    async function chat() {
        const txt = doms.txt.value.trim();
        if (!txt) {
            doms.txt.value = "";
            return;
        }

        //创建标准的聊天对象，发送给页面函数
        const data = {
            content: txt,
            createdAt: Date.now(),
            from: user.loginId,
            to: null,
        };
        setChat(data);
        doms.txt.value = "";
        console.log(txt);
        //将信息发送给服务器接收返回结果
        const resp = await API.sendChat(data);
        console.log(resp.data);
        const reply = {
            to: user.nickname,
            ...resp.data,
        };
        //将回复显示到页面上
        setChat(reply);
    }

    //初始化
    function init() {
        initUserInfo(); //初始化页面信息
        toGetHistory(); //加载历史记录
    }
    init();

    //注册提交事件
    doms.form.onsubmit = (e) => {
        e.preventDefault();
        chat();
    };
})();