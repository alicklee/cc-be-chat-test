const Cache = require('ttl-mem-cache');
const Config = require('../config/config');

//热词模块
class Popular {
    constructor() {
        this.app = new Cache();
    }

    //添加聊天记录到cache并设置ttl
    Add(username, words_arr) {
        this.app.set(username + Date.now().toString(), words_arr, Config.popular_time);
        console.log(this.app.entries());
    }

    //获取热度最高的一个词
    Get() {
        //获取聊天记录并把单词拆分成数组
        var all = this.app.entries();
        var arr = []
        all.forEach(function (words) {
            words.forEach(function (word) {
                arr.push(word)
            })
        })
        //以单词为key，对出现次数统计
        var index_arr = {};
        arr.forEach(function (word) {
            if (index_arr[word]) {
                index_arr[word]++
            } else {
                index_arr[word] = 1;
            }

        });
        //降序排列出现频率的结构
        var items = Object.keys(index_arr).map(function (key) {
            return [key, index_arr[key]];
        });
        items.sort(function (first, second) {
            return second[1] - first[1];
        });
        //如果有记录就返回第一个单词
        if (items.length > 0) {
            return items[0][0]
        }
        return null
    }
}

const obj = {};
obj.init = function () {
    return new Popular();
};

module.exports = obj;