var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config= {
    user: 'ashanirmal',
    database: 'ashanirmal',
    host: 'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
}
var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));

var articles = {
'article-one' : {
    title: 'Article one - Asha Nirmal',
    heading: 'News of the Day',
    date: 'Aug 9, 2017',
    content: `<p>The poll for three Rajya Sabha seats in Gujarat has assumed all the proportions of a national election, thanks to the fierce contest anticipated between the Congress's Ahmed Patel and his former party colleague Balwantsinh Rajput, who skipped to the BJP last month.</p>
        <p>After a gap of two decades, there's a real in the Rajya Sabha polls in Gujarat. It used to be that official nominees of major parties would get elected unopposed. Not today. There are four contestants eyeing three Rajya Sabha seats in Gujarat. They are BJP president Amit Shah, Union Minister Smriti Irani, Rajput and Patel.</p>
        <p>Varnika, daughter of additional chief secretary of Haryana Tourism, is one of the few woman DJs in Chandigarh</p>
        <p>Bonnie S Glaser said China sees India as biggest rising power that could pose challenge. Chinese President Xi Jinping sees Prime Minister Narendra Modi as a leader who is willing to stand up for Indian interests and to work together with other countries in the region that are looking to impose constraints on China, a top American Chinese expert has said.</p>`
    
    }  ,
'article-two' : {
    title: 'Article two - Asha Nirmal',
    heading: 'News of the Day',
    date: 'Aug 10, 2017',
    content: `<p>The poll for three Rajya Sabha seats in Gujarat has assumed all the proportions of a national election, thanks to the fierce contest anticipated between the Congress's Ahmed Patel and his former party colleague Balwantsinh Rajput, who skipped to the BJP last month.</p>
        <p>After a gap of two decades, there's a real in the Rajya Sabha polls in Gujarat. It used to be that official nominees of major parties would get elected unopposed. Not today. There are four contestants eyeing three Rajya Sabha seats in Gujarat. They are BJP president Amit Shah, Union Minister Smriti Irani, Rajput and Patel.</p>
        <p>Varnika, daughter of additional chief secretary of Haryana Tourism, is one of the few woman DJs in Chandigarh</p>
        <p>Bonnie S Glaser said China sees India as biggest rising power that could pose challenge. Chinese President Xi Jinping sees Prime Minister Narendra Modi as a leader who is willing to stand up for Indian interests and to work together with other countries in the region that are looking to impose constraints on China, a top American Chinese expert has said.</p>`
    
    }  ,
'article-three' : {
    title: 'Article three - Asha Nirmal',
    heading: 'News of the Day',
    date: 'Aug 11, 2017',
    content: `<p>The poll for three Rajya Sabha seats in Gujarat has assumed all the proportions of a national election, thanks to the fierce contest anticipated between the Congress's Ahmed Patel and his former party colleague Balwantsinh Rajput, who skipped to the BJP last month.</p>
        <p>After a gap of two decades, there's a real in the Rajya Sabha polls in Gujarat. It used to be that official nominees of major parties would get elected unopposed. Not today. There are four contestants eyeing three Rajya Sabha seats in Gujarat. They are BJP president Amit Shah, Union Minister Smriti Irani, Rajput and Patel.</p>
        <p>Varnika, daughter of additional chief secretary of Haryana Tourism, is one of the few woman DJs in Chandigarh</p>
        <p>Bonnie S Glaser said China sees India as biggest rising power that could pose challenge. Chinese President Xi Jinping sees Prime Minister Narendra Modi as a leader who is willing to stand up for Indian interests and to work together with other countries in the region that are looking to impose constraints on China, a top American Chinese expert has said.</p>`
    
    } 
}
function createTemplate (data){
    var title = data.title;
    var heading = data.heading;
    //var date = data.date;
    var dateStr = data.date.toString(); 
    var content = data.content;
    /*var htmltemplate =`<html>
        <head>
            <title>${title}</title>
            <meta name="viewport" content="width-device-width, initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
            <h3>${heading}</h3>
            <!--<div>${dateStr}</div>-->
            <div>
               ${content}
            </div>
            </div>
        </body>
    </html>
    `;*/
    //return "<html><head></head><body>data</body></html>"
    return data;
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
app.get('/:aName', function (req, res) {
    var articleName = req.params.aName;
    var qry = "SELECT * from article where title = '"+articleName +"'";
    pool.query(qry , function (err, result) {
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
