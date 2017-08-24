console.log('Loaded!');
//change the text of main element

//move the image
var madi = document.getElementById('madi');
var marginLeft = 0; 
function moveRight() {
    marginLeft = marginLeft + 5;
    madi.style.marginLeft = marginLeft + 'px';  
}
madi.onclick = function () {
    var interval = setInterval(moveRight,50);
    
};
var button=document.getElementById('counter');
button.onclick = function() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === XMLHttpRequest.DONE){
          console.log('request status : ' + req.status);
          if (req.status === 200){
              console.log('response : ' + req.responseText);
              var counter = req.responseText;
              var span = document.getElementById('count');
              span.innerHTML = counter + ' ';
          }
      }  
    };
    
    req.open('GET', 'http://ashanirmal.imad.hasura-app.io/counter',true);
    req.send(null);
    console.log('called counter api');
};



//submit name
var nameInput = document.getElementById('name');
var submit = document.getElementById('submit_btn');
submit.onclick = function (){
    var name1 = nameInput.value;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === XMLHttpRequest.DONE){
          console.log('request status : ' + req.status);
          if (req.status === 200){
              console.log('response : ' + req.responseText);
              var names = JSON.parse(req.responseText);
              for (var nm in names){
                  console.log('name '+nm);
              }
              var list ='';
              for (var i=0; i < names.length; i++){
                  list += '<li>'+ names[i]+'</li>';
              }
              var ul = document.getElementById('namelist');
              ul.innerHTML = list;
          }
      }  
    };
    console.log('name1 '+name1);
    req.open('GET', 'http://ashanirmal.imad.hasura-app.io/submit-name?name='+name1,true);
    req.send(null);
    console.log('called name api');
};

//Login
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
var login = document.getElementById('login-btn');
login.onclick = function (){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === XMLHttpRequest.DONE){
          console.log('request status : ' + req.status);
          if (req.status === 200){
              console.log('User logged in');
              alert ('Logged in successfully');
          }
          else if (req.status === 403){
              alert ('Username or password is wrong');
          }
          else {
              alert ('Something is wrong at server');
          }
      }  
    };
    console.log('login : '+ username + ' password : '+password);
    req.open('POST', 'http://ashanirmal.imad.hasura-app.io/login',true);
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify({username:username,password:password}));
    console.log('called name login api');
};