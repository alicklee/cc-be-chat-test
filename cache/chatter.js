//封装了chatter对象
class Chatter {
    constructor() {
        this.users = [];
    }
    //添加一个chatter的在线记录
    Add(name){
        var dict = {}
        dict[name] = Date.now()
        this.users.push(dict)
    }
    Get(name){
        for( var key in this.users){
            if (this.users[key] && this.users[key][name]) {
                return name;
            }
        }
        return null;
    }
    //删除一个chatter的在线记录
    Del(name){
        for(var key in this.users){
            if(this.users[key]){
                delete this.users[key]
            }
        }
    }
    //获取上线时长
    OnlinTime(name) {
        for (var key in this.users) {
            if (this.users[key] && this.users[key][name]) {
                return name+"已经登录了 "+this.GetDurationFormat(Date.now() + 1000 - this.users[key][name]);
            }
        }
    }
    //格式化上线时长
    GetDurationFormat(my_time) {
        var days    = my_time / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days);
        var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound = Math.floor(hours);
        var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound = Math.floor(minutes);
        var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        var time =daysRound + '天'+ hoursRound + '时'+ minutesRound + '分' + seconds + '秒';
        return time;
    }
}
module.exports=new Chatter();