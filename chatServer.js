// 加载node上websocket模块 ws;
const ws = require("ws");
// 加载聊天缓存
const History = require("./cache/history");
//加载filter过滤模块
const Filter = require("./utils/filter");
//加载chatter模块
const Chatter = require("./cache/chatter");
//加载聊天类型枚举
const MessageType = require("./enum/MessageTypeEnum");
//加载配置文件
const config = require("./config/config");
//加载热词模块
const Popular = require("./cache/popular");
const popular = Popular.init();
const timer = require("./utils/timer");


//启动websocket的服务器
const server = new ws.Server({
    host: config.address,
    port: config.port,
});

// 监听接入进来的客户端事件
function websocket_add_listener(client_sock) {
    // close事件
    client_sock.on("close", function () {
        Chatter.Del(client_sock.clientName);
        console.log(client_sock.clientName,"close gone");
    });
    // error事件
    client_sock.on("error", function (err) {
        console.log("client error", err);
    });
    // onMessage事件
    client_sock.on("message", function (data) {
        var obj = JSON.parse(data);
        var username = obj.username;
        var context = obj.message;
        var message_type = obj.type;
        var time = obj.time;
        //根据消息类型处理各自的情况
        switch (message_type) {
            case MessageType.LOGIN:
                login_handler(username,client_sock);
                break;
            case MessageType.STATS:
               stats_handler(context,client_sock);
                break;
            case MessageType.POPULAR:
                popular_handler(client_sock);
                break;
            default:
                normal_handler(message_type,username,context,client_sock,time);
                break;
        }
    });
}

// connection 事件, 有客户端接入进来;
function on_server_client_comming(client_sock) {
    console.log("client comming");
    send_history(client_sock)
    //发送最后50条记录
    send_history(client_sock, config.history_num)
    websocket_add_listener(client_sock);
}

server.on("connection", on_server_client_comming);

// error事件,表示的我们监听错误;
function on_server_listen_error(err) {
}

server.on("error", on_server_listen_error);

// headers事件, 回给客户端的字符。
function on_server_headers(data) {
}

server.on("headers", on_server_headers);

// 登录处理函数
function login_handler(username,client_sock) {
    client_sock.clientName = username;
    Chatter.Add(username)
    console.log(Chatter.users)
    server.clients.forEach(function (client) {
        client.send(username + "进入了聊天室")
    })
}

//stats处理函数
function stats_handler(message) {
    var username = message;
    var res = Chatter.OnlinTime(username)
    if(res!=null){
        client_sock.send(res);
    }else{
        client_sock.send("找不到 " + username);
    }
}


//热词处理函数
function popular_handler(client_sock) {
    var message = popular.Get();
    if (message) {
        client_sock.send(message)
    } else {
        client_sock.send("no popular word")
    }
}

//普通聊天的处理
function normal_handler(message_type,username,context,client_sock,time) {
    //过滤聊天消息并群发给在线用户
    Filter.ReadFileToArr(config.black_file, function (words) {
        var date = new Date(time);
        var message_time = timer.format(date);
        context = Filter.DoFilter(context, words);
        if (message_type === MessageType.NORMAL) {
            History.Add(message_time + " --- " + username + "说：" + context);
            popular.Add(username, context.toString().split(" "))
        }
        server.clients.forEach(function (client) {
            client.send(message_time + " --- " + username + "说：" + context)
        })
    });
}

//发送历史聊天记录
function send_history(client_sock, num) {
    //发送最后50条记录
    var history = History.Get()
    if (history.length > 0) {
        for (var i = 0; i < num; i++) {
            if (history[i]) {
                client_sock.send(history[i])
            }
        }
    }
}

