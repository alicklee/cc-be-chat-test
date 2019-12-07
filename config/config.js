const config = {
    //聊天历史记录保存条数
    history_num: 50,
    //主机地址
    address: "127.0.0.1",
    //端口号
    port: "1125",
    //热词搜索时间范围
    popular_time: 5 * 60 * 1000,
    //敏感词排除名单
    black_file: "./black.txt"
};
module.exports = config;