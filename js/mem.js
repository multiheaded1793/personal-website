/*
* Create a list that holds all of your cards
*/
let cards = ['diamond','diamond', 'paper-plane-o','paper-plane-o', 'anchor','anchor', 'bolt','bolt', 'cube','cube', 'leaf','leaf', 'bicycle','bicycle', 'bomb','bomb'];

let openedCards = [];
let lockedCards = [];
let matches = 0;
let moveCounter = 0;

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
function resetBoard() {
  document.getElementById('mem-deck-area').innerHTML='';
  shuffle(cards);
  dealCards();
  openedCards = [];
  lockedCards = [];
  moveCounter = 0;
  document.querySelector('.moves').textContent=moveCounter;
  matches = 0;
}

function dealCards() {
  for (card of cards) {
    let newCard = document.createElement('li');
    newCard.classList.add('card');
    let symbol = document.createElement('i');
    symbol.classList.add('fa', 'fa-'+card);
    newCard.appendChild(symbol);
    document.getElementById('mem-deck-area').appendChild(newCard);
  }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}



function checkCards() {
  if (openedCards[0].firstChild.classList[1]==openedCards[1].firstChild.classList[1]) {
    // console.log(document.getElementsByClassName(openedCards[0].firstChild.classList[1])[0].parentElement);
    document.getElementsByClassName(openedCards[0].firstChild.classList[1])[0].parentElement.classList.add('match');
    document.getElementsByClassName(openedCards[0].firstChild.classList[1])[1].parentElement.classList.add('match');
    openedCards = [];
    matches++;
    console.log('Match! ' + matches);
    if (matches == cards.length/2) {
      victoryMsg();
    }
  }
  else {
    console.log('No match!');
    console.log(openedCards[0].firstChild.classList[1]);
    openedCards = [];
    // console.log(document.querySelectorAll('.'+openedCards[0].firstChild.classList[1])[0].parentElement);
  }
}

function rotateCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function openCard(card) {
  openedCards.push(card);
}

function flipAll() {
  let allOpen = document.querySelectorAll("li.open");
  for (card of allOpen) {
    card.classList.remove('show', 'open');
  }
}

function seeCard(e) {
  if (e.target.nodeName === 'LI') {
    if (!e.target.classList.contains('match') && !e.target.classList.contains('open')) {
      switch (openedCards.length) {
        case 0:
        flipAll();
        rotateCard(e.target);
        openCard(e.target);
        moveCounter++
        console.log('c0');
        break;
        case 1:
        rotateCard(e.target);
        openCard(e.target);
        checkCards();
        moveCounter++
        console.log('c1');
        break;
        default:
        openedCards = [];
        flipAll();
        console.log('cd');
      }
      if (moveCounter==20||moveCounter==40||moveCounter==60) {
        let stars = document.querySelector('.stars');
        console.log(stars.getElementsByTagName("LI"));
        stars.removeChild(stars.getElementsByTagName("LI")[0]);
        console.log('!!!');
      }
      document.querySelector('.moves').textContent=moveCounter;
    }
  }
}

function victoryMsg() {
  setTimeout(function(){alert(`You won the game in ${moveCounter} moves!`)}, 500);
}

/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one) - DONE
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) - DONE
*  - if the list already has another card, check to see if the two cards match -DONE
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) - DONE
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) - DONE
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) - DONE
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) - DONE
*/
document.getElementById('mem-deck-area').addEventListener('click', seeCard, false);
document.getElementById('mem-restart').addEventListener('click', resetBoard, false);

document.addEventListener("DOMContentLoaded", function(){
  shuffle(cards);
  dealCards();
});
