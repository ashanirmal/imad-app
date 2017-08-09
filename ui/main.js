console.log('Loaded!');
//change the text of main element
var element = document.getElementById('maintext');
element.innerHTML = 'New Value';

//move the image
var madi = document.getElementById('madi');
var marginLeft = 0; 
function moveRight() {
    marginLeft = marginLeft + 10;
    madi.style.marginLeft = marginLeft + 'px';  
}
madi.onClick = function () {
    var interval = setInterval(moveRight,100);
    
};