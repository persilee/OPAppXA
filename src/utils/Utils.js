function isPoneAvailable(str) {
    return /^[1][3,4,5,6,7,8][0-9]{9}$/.test(str.trim());
}

/**     * 验证密码是否合格 长度不小于6位数的数字和字母组合     * @param {*} password      */
function checkPassWord(pwd) {
    if (!pwd || pwd.length < 6 ) {
        return false;
    }
    // let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    let reg = new RegExp(/^[a-zA-Z0-9]{6,16}/);
    return reg.test(pwd);
}

function formatDate(date, fmt) {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}

function copyData(target) {
    //先判断类型，再拷贝
    function checkType(val) {
        return Object.prototype.toString.call(val).slice(8, -1);
    }

    let res, type = checkType(target);
    if (type === 'Object') {
        res = {};
    } else if (type === 'Array') {
        res = [];
    } else {
        return target;
    }
    for (let i in target) { //数组和对象 for in 循环
        let value = target[i];
        if (checkType(value) === 'Object' || checkType(value) === 'Array') { //嵌套
            res[i] = copyData(value);
        } else { //基本数据或者函数
            res[i] = value;
        }
    }
    return res;
}

export {
    isPoneAvailable,
    checkPassWord,
    formatDate,
    groupBy,
    copyData,
}
