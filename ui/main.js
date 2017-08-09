console.log('Loaded!');
//change the text of main element
var element = document.getElementById('maintext');
element.innerHTML = 'New Value';

//move the image
var madi = document.getElementById('madi');
madi.onClick = function () {
  madi.style.marginLeft = '100px';  
};