const async = require('async');
const db = require('../config').db;
const debug = require('debug')('blog:update:save');

/**
 * 
 * 保存分类数据导数据中
 * @param {Object} list
 * @param {Function} callback
 */
exports.classList = function (list, callback){
    debug('保存分类文章到数据库中： %d',list.length);
    console.log('baocunfenleishuju')
    async.eachSeries(list, function(item, next){
        //查询分类是否已存在
        db.query('SELECT * FROM `class_list` WHERE `id`=? LIMIT 1',[item.id],
        function(err,data){
            if(err) return next(err);
            if(Array.isArray(data) && data.length >= 1){
                //分类已存在更新
                db.query('UPDATE `class_list` SET `name`=?, `url`=? WHERE `id`=?',[item.name,item.url,item.id],next);
            }else{
                //分类不存在添加
                db.query('INSERT INTO `class_list` (`id`,`name`,`url`) VALUES (?,?,?)',[item.id,item.name,item.url],next)
            }
        })
    },callback);
};
/**
 * 
 * 保存文章列表
 * 
 * @param {Number} class_id
 * @param {Object} list
 * @param {Function} callback
 */
exports.articleList = function (class_id,list, callback){
    console.log(class_id+"hahah");

    async.eachSeries(list, function(item, next){
        //查询分类是否已存在
        db.query('SELECT * FROM `article_list` WHERE `id`=? AND `class_id`=? LIMIT 1',[item.id,class_id],
        function(err,data){
            if(err) return next(err);

            //将发布时间转换成时间戳
            var created_time = new Date(item.time).getTime()/1000;
            if(Array.isArray(data) && data.length >=1){
                //分类已存在更新
                db.query('UPDATE `article_list` SET `title`=?, `url`=?, `class_id`=?, `created_time`=? WHERE `id`=? AND `class_id`=?' ,[item.title,item.url,class_id,created_time,item.id,class_id],next);
            }else{
                //分类不存在添加
                db.query('INSERT INTO `article_list`(`id`,`title`,`url`,`class_id`,`created_time`) VALUES (?,?,?,?,?)',[item.id,item.title,item.url,class_id,created_time],next);
            }
        })
    },callback);
};

/**
 * 
 * 保存文章分类的文章数量
 * 
 * @param {Number} class_id
 * @param {Number} count
 * @param {Function} callback
 */
exports.articleCount = function (class_id,count, callback){
    debug('保存分类文章到数据库中：%d, %d',class_id,count);
    console.log("保存分类数据");

        db.query('UPDATE `class_list` SET `count`=? WHERE `id`=?',[count,class_id],callback)
};


/**
 * 
 * 保存文章标签
 * @param {String} id
 * @param {Array} tags
 * @param {Function} callback
 */
exports.articleCTags = function (id,tags, callback){
    debug('保存分类文章到数据库中：%s, %s',id,tags);

        db.query('DELETE FROM `article_tag` WHERE `id`=?',[id],function(err){
            if(err) return callback(err);

            if(tags.length > 0){
                //添加新标签信息，生成sql语句

                var values = tags.map(function(tag){
                    return '('+ db.escape(id) +','+db.escape(tag)+')'
                }).join(',');

                db.query('INSERT INTO `article_tag`(`id`,`tag`) VALUES'+values,callback);
            }else{
                //如果没有标签直接返回
                callback(null);
            }
        })
};

/**
 * 
 * 保存文章内容
 * 
 * @param {String} id
 * @param {Array} tags
 * @param {String} content
 * @param {Function} callback
 */
exports.articleDetail = function (id, tags, content, callback){
    debug('保存文章内容：%s,',id);

        //查询是否已存在
        db.query('SELECT `id` FROM `article_detail` WHERE `id`=?',[id],
        function(err,data){
            if(err) return callback(err);

            tags = tags.join(' ');


            if(Array.isArray(data) && data.length >=1){
                //更新
                db.query('UPDATE `article_detail` SET `tags`=?, `content`=? WHERE `id`=?' ,
                [tags, content, id],callback);
            }else{
                //添加
                db.query('INSERT INTO `article_detail` (`id`,`tags`,`content`) VALUES (?,?,?)',
                [id, tags, content], callback);
            }
        })
};

/**
 * 
 * 检查文章是否存在
 * 
 * @param {String} id
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @param {Function} callback
 */
exports.isAericleExists = function (id, callback){

        db.query('SELECT `id` FROM `article_detail` WHERE `id`=?',[id],function(err, data){
            if(err) return callback(err);
            callback(null, Array.isArray(data) && data.length >= 1)
        })
};