const request = require('request');
const cheerio = require('cheerio');
const debug = require('debug');
debug('读取博列表');

//读取分类页面
function readArticleList(url, callback){
    request(url, function(err, res){
        if(err) return console.error(err);
        //根据网页内容穿件dom操作对象
        var $ = cheerio.load(res.body.toString());

        //读取博文类别列表
        var articleList = [];
        $('.articleList .articleCell').each(function(){
            var $me = $(this);
            var $title = $me.find('.atc_title a');
            var $time = $me.find('atc_tm');
            var item = {
                title: $title.text().trim(),
                url: $title.attr('href'),
                time: $time.text().trim()
            };
        // 从url中取出分类的id
        var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);//match 返回一个正则匹配的数组
        if (Array.isArray(s)){
            item.id = s[1];
            articleList.push(item);
        }
        })

        //检查是否有下一页
        var nextUrl = $('.SG_pgnext a').attr('href');
        if(nextUrl){
            readArticleList(nextUrl, function(err, articleList2){
                if(err) return callback(err);
                //合并结果
                callback(null, articleList.concat(articleList2));
            })
        }else{
            //返回结果
            callback(null, articleList);
        }
    }) 

}
readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html', function(err, articleList){
    if(err) console.error(err.stack);
    console.log(articleList);
})