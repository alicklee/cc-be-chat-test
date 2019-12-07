const config = require("../config/config")
const MAXLEN = config.history_num
var obj = {}
class Queue {
    constructor(max_len) {
        this.filelist=[];
        this.top=0;
        this.max_len = max_len
    }
    Push(data){
        this.filelist.push(data);
        if(this.filelist.length >  this.max_len){
            this.filelist.splice(this.top,1);
        }
    }
}
obj.init_queue = function(max_len){
    return new Queue(max_len)
}
module.exports= obj;
