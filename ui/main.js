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
        console.log('request state : ' + req.readyState);
        console.log('DONE : '+ XMLHttpRequest.DONE);
      if (req.readyState === XMLHttpRequest.DONE){
          console.log('request status : ' + req.status);
          if (req.status === 200){
              var counter = req.response.Text;
              var span = document.getElementById('count');
              span.innerHTML = '33';
          }
      }  
    };
    
    req.open('GET', 'http://ashanirmal.imad.hasura-app.io/counter',true);
    req.send(null);
    console.log('called counter api');
};