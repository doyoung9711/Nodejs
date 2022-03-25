var express=require('express');
var router = express.Router();
const template = require("../lib/template");

router.get('/', function(req,res) {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const list = template.list(req.list);
    const html = template.html(title, list, `<h2>${title}
    </h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block;
        margin-top;">`,
        `<a href="/topic/create">create</a>`);
    res.send(html);  //writeHead + end
})
//=== app.get('/',function(req,res){
//  return res.send('Hello World!')
// })

module.exports=router;

