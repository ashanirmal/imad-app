var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config= {
    user: 'ashanirmal',
    database: 'ashanirmal',
    host: 'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
};
var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'Some-Random-String',
    cookie: {maxAge: 1000 * 60 * 5} //5 min
}));

function createTemplate (data){
    var title = data.title;
    var heading = data.heading;
    //var date = data.date;
    var dateStr = data.date.toDateString(); 
    var content = data.content;
    var htmltemplate =`<html>
        <head>
            <title>${title}</title>
            <meta name="viewport" content="width-device-width, initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
            <h3>${heading}</h3>
            <div>${dateStr}</div>
            <br>
            <div>
               ${content}
            </div>
            </div>
        </body>
    </html>
    `;
    //return "<html><head></head><body>data</body></html>"
    return htmltemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
  res.send(counter.toString());
});
var names = [];
app.get('/submit-name', function (req, res) {
    names.push(req.query.name);
    //Send JSON
  res.send(JSON.stringify(names));
});
app.get('/test-db', function (req, res) {
    //make a db req and send response
    pool.query('SELECT * FROM article', function (err, result) {
        if (err){
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result.rows));
        }
    });
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

function hash (input, salt)
{
    var result = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2Sync','10000',salt,result.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res) {
    var hashedstring = hash(req.params.input,'this-is-a-random-string');
    res.send(hashedstring);
});

app.post('/create-user', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    pool.query('INSERT INTO "user"(username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        var responsejson = {};
        if (err){
            res.status(500).send(err.toString());
        } else {
            responsejson["message"] = "User successfully created : "+username;
            res.send(JSON.stringify(responsejson));
        }
    } );
});


app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
        var responsejson = {};
        if (err){
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                responsejson["message"] = "Username/Password is invalid";
                res.status(403).send(JSON.stringify(responsejson));
            }
            else {
                //Match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password,salt);
                if (hashedPassword === dbString) {
                    req.session.auth = {userId: result.rows[0].id};
                    responsejson["message"] = "User successfully logged in : "+username;
                    res.send(JSON.stringify(responsejson));
                }
                else {
                    responsejson["message"] = "Username/Password is invalid";
                    res.status(403).send(JSON.stringify(responsejson));
                }
            }
        }
    } );
});

app.get('/get-articles', function (req, res) {
    pool.query('SELECT * FROM "article"',null,function(err,result){
        var responsejson = [];
        if (err){
            res.status(500).send(err.toString());
        } else {
            var len = result.rows.length;
            if (len === 0) {
                responsejson["message"] = "No articles found";
                res.status(403).send(JSON.stringify(responsejson));
            }
            else {
                for (var i = 0; i < len; i++) {
                    var article = {};
                    article["id"] = result.rows[i].id;
                    article["title"] = result.rows[i].title;
                    article["heading"] = result.rows[i].heading;
                    article["date"] = result.rows[i].date;
                    article["content"] = result.rows[i].content;
                    responsejson[i] = article;
                }
                res.send((responsejson));
            }
        }
    } );
});

app.get('/check-login',function(req,res){
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.send('You are logged in as : '+req.session.auth.userId);
    }
    else {
        res.send('You are not logged in');
    }
});
app.get('/logout',function (req,res) {
    delete req.session.auth;
    res.send('You are logged out');
});

app.get('/:aName', function (req, res) {
    var articleName = req.params.aName;
    var qry = "SELECT * from article where title = $1";
    pool.query(qry ,[articleName], function (err, result) {
       if (err){
            res.status(500).send(err.toString());
        }
        else {
            if (result.rows.length === 0) {
                res.status(400).send("Article Not Found");
            }
            else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/article-three', function (req, res) {
  res.send("Article three requested");
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
