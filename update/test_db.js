const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const debug = require('debug');

//创建数据库连接
var db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    database: 'sina_blog',
    user: "root",
    password: "root"
});
// 显示所有数据表
db.query('show tables', function (err, tables){
    if(err){
        console.error(err,stack);
    }else{
        console.log(tables);
    }
    //关闭连接
    db.end();
})