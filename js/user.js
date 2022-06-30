//用户登录和注册表单项的通用代码
class verification {
    /**
     * 可以理解为构造函数，初始化创建的对象，内部有多种属性
     * @param {String} txtId 传入文本框的id
     * @param {fuction} verFunction 传入验证的函数，在要进行验证时，调用该函数，该函数返回验证的提示文本，若没有返回null
     */
    constructor(txtId, verFunction) {
        this.txt = $("#" + txtId); //文本框的dom
        this.p = this.txt.nextElementSibling; //提示文本的dom
        this.rule = verFunction; //保存对该对象的验证方法
        //当取消聚焦时，跳转进行验证
        this.txt.onblur = () => {
            //按照语法格式调用，箭头函数没有this，它所指的this在上一层中
            this.validate();
        };
    }

    /**
     * 验证，成功返回true 失败返回false，随对象的产生而出现的方法。
     */
    async validate() {
        const result = await this.rule(this.txt.value);
        if (result) {
            //有错误时
            this.p.innerText = result;
            return false;
        } else {
            this.p.innerText = "";
            return true;
        }
    }

    /**
     * 这是个静态方法，通过类即可直接调用
     * 查看是否所有的验证均已经通过，若全部通过，返回true，否则返回false
     */
    static async validateAll(...validates) {
        const promises = validates.map((item) => item.validate()); //map映射每一项，调用他们的验证方法。返回promises对象
        console.log(promises);
        const result = await Promise.all(promises);
        console.log(result);
        return result.every((item) => item);
    }
}

// //对账号进行验证
// var ver = new verification("txtLoginId", async function(val) {
//     if (!val) {
//         return "账号不能为空";
//     }
//     const resp = await API.exists(val);
//     console.log(resp);
//     if (resp.data) {
//         return "该账号已被注册，请选择其他账号";
//     }
//     return null;
// });

// //对昵称进行验证
// const nameVerification = new verification("txtNickname", function(val) {
//     if (!val) {
//         return "昵称不能为空";
//     }
//     return null;
// });

// //对密码进行验证
// const pwdVerification = new verification("txtLoginPwd", function(val) {
//     if (!val) {
//         return "密码不能为空";
//     }
// });

// //对密码进行二次验证
// const pwdverification = new verification("txtLoginPwdConfirm", function(val) {
//     const pwd = pwdVerification.txt.value;
//     if (!val) {
//         return "密码不能为空";
//     }
//     if (pwd === val) {
//         return null;
//     } else {
//         return "两次密码不一致";
//     }
// });