const fs = require('fs');
const readline = require('readline');
class Filter {
    //逐行读取黑名单列表的关键字到数组
    ReadFileToArr(fReadName,callback){
        var fRead = fs.createReadStream(fReadName);
        var objReadline = readline.createInterface({
            input:fRead
        });
        var arr = new Array();
        objReadline.on('line',function (line) {
            arr.push(line);
        });
        objReadline.on('close',function () {
            callback(arr);
        });
    }
    //过滤替换所有的敏感字为**
    DoFilter(message,blackfile){
        for (var i=0; i <blackfile.length;i++){
            message = message.replace(new RegExp(blackfile[i],'g'), "**")
        }
        return message
    }
}
module.exports=new Filter();