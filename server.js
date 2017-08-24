var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');

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
    return result.toString('hex');
}
app.get('/hash/:input', function (req, res) {
    var hashedstring = hash(req.params.input,'this-is-a-random-string');
    res.send(hashedstring);
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
