const request = require('request');
const cheerio = require('cheerio');
const debug = require('debug');
debug('读取博文类别列表');

//读取博客首页
request('http://blog.sina.com.cn/u/1776757314', function(err, res){
    if(err) return console.error(err);
    //根据网页内容穿件dom操作对象
    var $ = cheerio.load(res.body.toString());

    //读取博文类别列表
    var classList = [];
    $('.classList li a').each(function(){
        var $me = $(this);
        var item = {
            name: $me.text().trim(),
            url: $me.attr('href')
        };
    // 从url中取出分类的id
    var s = item.url.match(/articlelist_\d+_(\d+)_\d\.html/);//match 返回一个正则匹配的数组
    if (Array.isArray(s)){
        item.id = s[1];
        classList.push(item);
    }
    })
}) 