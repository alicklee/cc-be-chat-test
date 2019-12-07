const Queue = require("../utils/queue");
const Config = require("../config/config")
//封装了聊天历史对象
class History {
    constructor() {
        this.queue = Queue.init_queue(Config.history_num);
        this.filelist = this.queue.filelist
    }
    Get(){
        return this.filelist
    }
    Add(message){
        this.queue.Push(message)
    }
}
module.exports=new History();