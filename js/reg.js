//对账号进行验证
const ver = new verification("txtLoginId", async function(val) {
    if (!val) {
        return "账号不能为空";
    }
    const resp = await API.exists(val);
    console.log(resp);
    if (resp.data) {
        return "该账号已被注册，请选择其他账号";
    }
    return null;
});

//对昵称进行验证
const nameVerification = new verification("txtNickname", function(val) {
    if (!val) {
        return "昵称不能为空";
    }
    return null;
});

//对密码进行验证
const pwdVerification = new verification("txtLoginPwd", function(val) {
    if (!val) {
        return "密码不能为空";
    }
});

//对密码进行二次验证
const pwdverification = new verification("txtLoginPwdConfirm", function(val) {
    const pwd = pwdVerification.txt.value;
    if (!val) {
        return "密码不能为空";
    }
    if (pwd === val) {
        return null;
    } else {
        return "两次密码不一致";
    }
});

//给表单元素注册事件，此时最好的方法是找到表单元素，给它注册事件，而不是直接注册点击事件
const form = $(".user-form");
console.log(form);
form.onsubmit = async(e) => {
    //先取消表单默认事件（其中的自动提交事件）
    e.preventDefault();
    const result = await verification.validateAll(
        ver,
        nameVerification,
        pwdVerification,
        pwdverification
    );
    if (result) {
        //如果通过测试，进行提交
        // API.reg();
        const date = new FormData(form); //传入表单dom，得到数据对象
        console.log(date.entries()); //获得一个迭代器形式的信息（数组嵌套形式的数据）
        console.log(Object.fromEntries(date.entries())); //将58行的信息转换为对象形式
        let result = Object.fromEntries(date.entries());
        result = API.reg(result);
        if (!result.code) {
            // alert("点击确定跳转");
            location.href = "./login.html"; //跳转到新的地址（相对于当前目录的地址，浏览器处理页面流程中有讲到）
        }
        return;
    }

    return;
};