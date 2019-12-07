const {describe} =  require("mocha");
const assert = require('assert');
// 加载node上websocket模块 ws;
const ws = require("ws");
// 加载聊天缓存
const History = require("../cache/history");
//加载filter过滤模块
const Filter = require("../utils/filter");
//加载chatter模块
const Chatter = require("../cache/chatter");
//加载聊天类型枚举
const MessageType = require("../enum/MessageTypeEnum");
//加载配置文件
const config = require("../config/config");
//加载热词模块
const Popular = require("../cache/popular");
const popular = Popular.init();
const timer = require("../utils/timer");
const Queue = require("../utils/queue");

describe('chatter test',function(){
    it('should return name with add',function(){
        Chatter.Add("alicklee");
        assert.equal("alicklee",Chatter.Get("alicklee"));
    });
    it('should return null when user del', function () {
        Chatter.Add("alicklee");
        Chatter.Del("alicklee");
        assert.equal(null,Chatter.Get("alicklee"));
    });
    it('should return alicklee已经登录了 0天0时0分1秒 ', function () {
        Chatter.Add("alicklee");
        assert.equal("alicklee已经登录了 0天0时0分1秒",Chatter.OnlinTime('alicklee'))
    });
});


describe('history test',function(){
    it('初始的时候聊天记录应该为0',function(){
        History.Get();
        assert.equal(true,History.Get().length == 0);
    });
    it('添加一条记录之后记录条数应该为1',function(){
        History.Add('test messsage');
        assert.equal(true,History.Get().length == 1);
        assert.equal('test messsage',History.Get());
    });
});

describe('popular test',function(){
    it('初始的时候应该为0',function(){
        var popular = Popular.init();

        assert.equal(null,popular.Get());
    });
    it('添加一条记录之后记录条数热词应该是1',function(){
        var popular = Popular.init();
        popular.Add("alicklee",['1','1','2','3'])
        assert.equal('1',popular.Get());
    });
});

describe('config test',function(){
    it('获取address 应该是 127.0.0.1',function(){
        assert.equal("127.0.0.1",config.address);
    });
});


describe('MessageTypeEnum test',function(){
    it('normal 0 login 1 stats 2 popular 3',function(){
        assert.equal(0,MessageType.NORMAL);
        assert.equal(1,MessageType.LOGIN);
        assert.equal(2,MessageType.STATS);
        assert.equal(3,MessageType.POPULAR);
    });
});

describe('filter',function(){
    it('DoFilter hellboy 应该被过滤成**boy',function(){
        Filter.ReadFileToArr("./black.txt",function (data) {
            var context = "hellboy";
            context = Filter.DoFilter(context, data);
            assert("**boy",context);
            var context = "1112333";
            context = Filter.DoFilter(context, data);
            assert("1112333",context)
        })
    });
});

describe('queue',function(){
    it('添加一个元素长度应该大于1',function(){
            var queue = Queue.init_queue(50);
            queue.Push("alicklee",["11"])
        assert(true,queue.filelist.length>0)
    });
    it('queue的长度不能超过50',function(){
        var queue = Queue.init_queue(50);
        for(var i=0;i<60;i++){
            queue.Push("alicklee",["11"])
        }
        assert(true,queue.filelist.length <= 50)
    });
});
