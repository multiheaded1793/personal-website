/*
* Open the drawer when the menu icon is clicked.
*/

// var menu = document.querySelector('#menu');
// var main = document.querySelector('main');
// var drawer = document.querySelector('.nav');
//
// menu.addEventListener('click', function(e) {
//   drawer.classList.toggle('open');
//   e.stopPropagation();
// });
// main.addEventListener('click', function() {
//   drawer.classList.remove('open');
// });

const colorWell = document.getElementById('colorPicker');
const table = document.getElementById('pixelCanvas');
let color = colorWell.value;
// let gHeight;
// let gWidth;

function makeGrid(e) {
  TweenMax.from("#canvasWidget", 0.5, {boxShadow: "inset 0 0 20px 70px rgba(255, 125, 0, 0.8)"})
  let gHeight = document.getElementById('inputHeight').value;
  let gWidth = document.getElementById('inputWidth').value;
  console.log(gHeight+'x'+gWidth);
  table.innerHTML = '';
  for (let i=0; i<gHeight; i++) {
    let node = document.createElement('tr');
    table.appendChild(node);
  }
  let rows = document.querySelectorAll('table > tr');
  for (row of rows) {
    for (let i=0; i<gWidth; i++) {
      let node = document.createElement('td');
      row.appendChild(node);
    }
  }
}

function colorChange(e) {
  color = colorWell.value;
  console.log(color);
};

function randomColor(e) {
  color = '#'+(Math.random()*0xF<<0).toString(16)+(Math.random()*0xF<<0).toString(16)+(Math.random()*0xF<<0).toString(16)+(Math.random()*0xF<<0).toString(16)+(Math.random()*0xF<<0).toString(16)+(Math.random()*0xF<<0).toString(16);
  colorWell.setAttribute('value', color);
  console.log(color);
}

function randomPaint(e) {
  let rows = document.querySelectorAll('table > tr');
  for (row of rows) {
    let cells = row.querySelectorAll('td');
    for (cell of cells) {
      randomColor();
      cell.setAttribute('class', 'filled');
      cell.style.backgroundColor=color;
      let tx = document.createElement('span');
      let tt = document.createElement('div');
      tx.textContent=color;
      tx.setAttribute('class', 'tooltiptext');
      tt.setAttribute('class', 'tooltip');
      tt.appendChild(tx);
      cell.appendChild(tt);
    }
  }
  colorWell.setAttribute('value', "#000000");
}

function paintCell(e) {
  color = colorWell.value;
  if (e.target.nodeName === 'TD') {
    if (e.target.getAttribute('class') == 'filled') {
      e.target.setAttribute('class', '');
      e.target.style.backgroundColor='transparent';
      e.target.innerHTML='';
    }
    else {
      e.target.setAttribute('class', 'filled');
      e.target.style.backgroundColor=color;
      let tx = document.createElement('span');
      let tt = document.createElement('div');
      tx.setAttribute('class', 'tooltiptext');
      tt.setAttribute('class', 'tooltip');
      tx.textContent=color;
      tt.appendChild(tx);
      e.target.appendChild(tt);
    }
  }
}


document.getElementById('inputSubmit').addEventListener('click', makeGrid, false);
document.getElementById('colorPicker').addEventListener('change', colorChange, false);
document.getElementById('pixelCanvas').addEventListener('click', paintCell, false);
document.getElementById('inputRand').addEventListener('click', randomColor, false);
document.getElementById('inputRandAll').addEventListener('click', randomPaint, false);
