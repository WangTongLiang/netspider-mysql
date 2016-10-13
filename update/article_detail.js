const request = require('request');
const cheerio = require('cheerio');
const debug = require('debug');
debug('读取博文内容');

//读取博客首页
request('http://blog.sina.com.cn/s/blog_69e72a420102w9nm.html', function(err, res){
    if(err) return console.error(err);
    //根据网页内容穿件dom操作对象
    var $ = cheerio.load(res.body.toString());

    //读取博文类别列表
    var tags = [];
    $('.blog_tag h3 a').each(function(){
        var tag = $(this).text().trim();
        if(tag){
            tags.push(tag);
        }
    
}) ;
    var content = $('.articalContent').html().trim();
    console.log({tags:tags,content:content});
});