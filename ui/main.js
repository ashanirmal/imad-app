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
              console.log('response : ' + req.response.Text);
              var counter = req.response.Text;
              var span = document.getElementById('count');
              span.innerHTML = counter + ' ';
          }
      }  
    };
    
    req.open('GET', 'http://ashanirmal.imad.hasura-app.io/counter',true);
    req.send(null);
    console.log('called counter api');
};