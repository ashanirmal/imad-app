console.log('Loaded!');
//change the text of main element
var element = document.getElementById('maintext');
element.innerHTML = 'New Value';

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