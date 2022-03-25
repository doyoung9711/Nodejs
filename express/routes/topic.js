var express = require('express')
var router = express.Router()
const template = require("../lib/template");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

router.get('/create',function(req,res){

    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.html(title, list, `
          <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,'');
    res.send(html);

})

router.post('/create_process', function(req,res){
    /*var body = '';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description
        fs.writeFile(`data/${title}`,description,'utf-8',function(err){
            res.writeHead(302,{Location:`/?id=${title}`});
            res.end('success');
        })
    });*/ //bodyparser를 통해 아래코드
    var post = req.body;
    var title = post.title;
    var description = post.description
    fs.writeFile(`data/${title}`,description,'utf-8',function(err){
        res.writeHead(302,{Location:`/topic/${title}`});
        res.end('success');
    })
})

router.get('/update/:pageId',function(req,res){

    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.html(title, list, `
            <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title"
             value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`);
        res.send(html);
    });
})
router.post('/update_process', function(req,res){

    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description
    fs.rename(`data/${id}`,`data/${title}`,function(error){
        fs.writeFile(`data/${title}`,description,'utf-8',function(err){
            res.redirect(`/topic/${title}`)
            /*===res.writeHead(302,{Location:`/page/${title}`});//302는 다른곳으로 redirection시켜라.
            res.end('success');*/
        })
    })
})

router.post('/delete_process',function (req,res) {
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
        res.redirect('/')
    })
})

router.get('/:pageId',function(req,res,next){
    var filteredId = path.parse(req.params.pageId).base; //base -> main.js
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
            next(err); //맨 아래 에러처리로 app.use로이동
        }else{
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description,{
                allowedTags:['h1']
            });
            var list = template.list(req.list);
            var html = template.html(title, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `<a href="/topic/create">create</a> <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`);
            res.send(html);
        }
    })
})
module.exports=router;
