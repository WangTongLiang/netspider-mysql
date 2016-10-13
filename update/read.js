const originRequest = require('request');
const cheerio = require('cheerio');
const debug = require('debug')('blog:update:read');

/**
 * 请求指定url
 * 
 * @param {String} url
 * @param {Function} callback
 */
function request(url, callback){
    originRequest(url, callback);
};

/**
 * 获取文章分类列表
 * 
 * @param {String} url
 * @param {Function} callback
 */
exports.classList = function (url, callback){
    request(url, function(err, res){
        if(err) return callback(err);

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
};
/**
 * 获取分类页面博文列表
 * 
 * @param {String} url
 * @param {Function} callback
 */
exports.articleList = function (url, callback){
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

};
/**
 * 获取博文内容
 * 
 * @param {String} url
 * @param {Function} callback
 */
exports.articleDetail = function (url, callback){
    //读取博客首页
    request(url, function(err, res){
        if(err) return callback(err);
        //根据网页内容穿件dom操作对象
        var $ = cheerio.load(res.body.toString());

        //读取文章标签
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