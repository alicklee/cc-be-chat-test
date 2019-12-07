//时间戳format方法
const obj = {};
obj.format = function (date) {
           var arr = [date.getFullYear(),
               (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
               (date.getDay() + 1 < 10 ? '0' + (date.getDay() + 1) : date.getDay() + 1)
           ];
           var arr2 = [
               date.getHours(),
               date.getMinutes(),
               date.getSeconds()]
           var str1 = arr.join("-")
           var str2 = arr2.join(":")
           var message_time = str1 + " " + str2
           return message_time;
};

module.exports = obj;