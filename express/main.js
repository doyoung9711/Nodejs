const express = require('express')
const app = express()
const fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic.js');
var indexRouter = require('./routes/index.js')
var helmet=require('helmet')
app.use(helmet()); //보안

app.use(express.static('public')); //정적인 파일 서비스(img)...
app.use(bodyParser.urlencoded({extended: false})) //middle-ware
app.use(compression()); //압축해서 용량 줄여줌
app.get('*',function(req,res,next){
    fs.readdir('./data',function(error,filelist){
        req.list = filelist;
        next(); //그 다음 호출될 미들웨어
    })
})//get상태에서만 작동

//route, routing
app.use('/',indexRouter);
app.use('/topic',topicRouter);

//404 처리
app.use(function(req,res,next){
    res.status(404).send('Sorry cant find that!');
})
//error handler
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(3000,()=>console.log('Example app'))
