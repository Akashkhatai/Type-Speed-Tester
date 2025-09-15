
const words = 'The sun dipped below the horizon, casting a warm orange glow across the quiet village. Birds chirped their final songs of the day as a soft breeze rustled the leaves of the ancient oak trees. Children laughed in the distance, their silhouettes dancing against the fading light. It was one of those rare evenings where time seemed to slow down, allowing every sound, scent, and color to linger just a little longer. For a moment, everything felt perfectly in place.'.split(' ');
const wordsCount = words.length;
const gameTime=30*1000;
window.timer=null;
window.gameStart=null;
window.pauseTime=0;


//this two function is use to giving the name current as current word and current letter 
function addClass(el,name){
    el.className+= ' '+name;
}

function removeClass(el,name){
    el.className=el.className.replace(name,'') ;
}


// this func is use to to generate random number word
function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

//this is use to make single letter as class letter
function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
  

//this is use to add random 200 words 
function newGame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML=(gameTime/1000)+'';
  window.timer=null; 

}

function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);

  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
    const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });

  const timeSpentMs = (new Date()).getTime() - window.gameStart; // in ms
  const timeSpentMinutes = timeSpentMs / 60000;

  return Math.round(correctWords.length / timeSpentMinutes);
}



function gameOver(){
  clearInterval(window.timer);
  addClass(document.getElementById('game'),'over');
  const result =getWpm();
  document.getElementById('info').innerHTML=`WPM: ${result.toFixed(2)}`;
}

//this is use to event handling as when we press each key it check weather it right or not
document.getElementById('game').addEventListener('keyup', ev => {
    const key =ev.key;
    const currentWord =document.querySelector('.word.current');
    const currentLetter =document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' '  ;
    const isLetter = key.length === 1 && key  !==' ';
    const isSpace= key ===' ';
    const isBackspace = key === 'Backspace'; 
    const isFirstLetter = currentLetter === currentWord.firstChild;
    
    if(document.querySelector('#game.over')){
      return;
    } 

    console.log({key,expected})

    if(!window.timer && isLetter){
      window.timer =setInterval(() =>{
        if(!window.gameStart){
            window.gameStart =(new Date()).getTime();
        }
            const currentTime=(new Date()).getTime();
            const mspassed=currentTime-window.gameStart;
            const spassed=Math.round(mspassed/1000);
            const sLeft=Math.round(gameTime/1000)-spassed;
            if( sLeft<=0){
                gameOver();
                return;
            }
        document.getElementById('info').innerHTML = sLeft+'';
      },  1000);
    }

    if(isLetter){
      if(currentLetter){
        addClass(currentLetter,key === expected ? 'correct' : 'incorrect');
        removeClass(currentLetter,'current');
        if(currentLetter.nextSibling){
          addClass(currentLetter.nextSibling,'current');  
        }
      }else{
        const incorrctLetter = document.createElement('span');
        incorrctLetter.innerHTML = key;
        incorrctLetter.className='letter incorrect extra';
        // currentWord.appendChild(incorrctLetter);
      }
    }
    if(isSpace){
      if (expected !==' '){
        const lettersToInvaidate=[...document.querySelectorAll('.word.current.letter:not(correct)')];
        lettersToInvaidate.forEach(letter =>{
          addClass(letter,'incorrect');
        });
      }
      removeClass(currentWord,'current');
      addClass(currentWord.nextSibling,'current');
      if (currentLetter){
      removeClass(currentLetter,'current');
      }
      addClass(currentWord.nextSibling.firstChild,'current');

    }

    if(isBackspace){
      if(currentLetter && !isFirstLetter){
        //make prev word current and last letter current
        removeClass(currentWord,'current');
        addClass(currentWord.previousSibling,'current');
        removeClass(currentLetter,'current');
        addClass(currentWord.previousSibling.lastChild,'current');
        removeClass(currentWord.previousSibling.lastChild,'incorrect');
        removeClass(currentWord.previousSibling.lastChild,'correct');
      }
      if(currentLetter && !isFirstLetter){
          // move back one letter, invalidate letter
        removeClass(currentLetter,'current');
        addClass(currentLetter.previousSibling,'current');
        removeClass(currentLetter.previousSibling ,'incorrect');
        removeClass(currentLetter.previousSibling,'correct');
      }
      if(!currentLetter){
        addClass(currentWord.lastChild,'current');
        removeClass(currentWord.lastChild ,'incorrect');
        removeClass(currentWord.lastChild,'correct');
      }
    }
    //move lines/words
      if (currentWord.getBoundingClientRect().top > 250) {
        const words=document.getElementById('words');
        const margin =parseInt(words.style.marginTop || '0px')
        words.style.marginTop=(margin -35)+'px'; 
      }

    //move cursor
    const nextLetter=document.querySelector('.letter.current');
    const nextWord =document.querySelector('.word.current');
    const cursor =document.getElementById('cursor');
    cursor.style.top =(nextLetter||nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left =(nextLetter||nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] +'px';
  });

  document.getElementById("newGameBtn").addEventListener("click", function() {
    location.reload();
});


  document.getElementById('newGameBtn').addEventListener('click',() => {
   gameOver();
    newGame();
  });
newGame();
