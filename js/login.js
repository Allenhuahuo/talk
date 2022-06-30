const loginId = new verification("txtLoginId", function(val) {
    if (!val) {
        return "账号不能为空";
    }
    return null;
});
const loginPwd = new verification("txtLoginPwd", function(val) {
    if (!val) {
        return "密码不能为空";
    }
    return null;
});

const form = $(".user-form");
form.onsubmit = async(e) => {
    e.preventDefault(); //去除浏览器默认事件
    //判定填入的值是否符合要求
    let result = await verification.validateAll(loginId, loginPwd);
    if (result) {
        const date = new FormData(form);
        result = Object.fromEntries(date.entries());
        const resp = await API.login(result);
        console.log(resp);
        if (resp.code === 0) {
            //登录成功
            console.log("dnenglu");
            location.href = "./index.html"; //页面跳转
            return;
        } else {
            loginId.p.innerText = "账号或密码错误";

            return;
        }
    }
};