const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const debug = require('debug');
debug('读取博列表');
/**
 * 获取分类页面博文列表
 * 
 * @param {String} url
 * @param {Function} callback
 */
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
        });
        callback(null, articleList);
    }) 

};


/**
 * 获取分类页面博文列表
 * 
 * @param {String} url
 * @param {Function} callback
 * 'http://blog.sina.com.cn/s/blog_69e72a420102w9nm.html'
 */
function readArticleDetail(url, callback){
    //读取博客首页
    request(url, function(err, res){
        if(err) return callback(err);
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
        callback(null, {tags: tags,content: content});
    });
}

//读取分类下的所有文章
readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html', function(err, articleList){
    if(err) console.error(err.stack);
    //依次取出articleList 数组的每个元素，调用第二个参数中传入的函数
    //函数的第一个参数即是articleList 数组中的第一个参数
    //调用第二个参数是回调函数
    async.eachSeries(articleList, function(article, next){
        //读取文章内容
        readArticleDetail(article.url, function(err, detail){
            if(err) console.error(err.stack);
            //直接显示
            console.log(detail);

            //需要调用next()来返回
            next();
        })
    },function(err){
        // 遍历完articleList后，才执行回调函数
        if(err) return console.error(err.stack);
        console.log('完成');
    })
})