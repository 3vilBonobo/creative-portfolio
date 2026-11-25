const text =
  'My life fades, the vision dims. All that remains are memories. I remember a time of chaos, ruined dreams, this wasted land. But most of all, I remember the Road Warrior, the man we called Max. To understand who he was, you have to go back to another time when the world was powered by the black fuel and the deserts sprouted great cities of pipe and steel. Gone now, swept away. ';
const wordList = text.split(' ');
const container = document.querySelector('.container');
let red, blue, green;

//Random colors
const colorChanger = () => {
  red = Math.floor(Math.random() * 255);
  blue = Math.floor(Math.random() * 255);
  green = Math.floor(Math.random() * 255);
};

//Random element positioning
const scatterWords = () => {
  leftValue = Math.floor(Math.random() * window.innerWidth - 100);
  topValue = Math.floor(Math.random() * window.innerHeight - 100);
};

//Random blinking
const randomBlink = () => {
  let min = 5;
  let max = 10;
  animDuration = Math.floor(Math.random() * (max - min + 1)) + min;
};

// Element creation
const creatingWords = () => {
  container.innerHTML = '';
  for (let i = 0; i < wordList.length; i++) {
    let word = document.createElement('p');
    word.innerText = wordList[i];
    colorChanger();
    word.style.color = `rgb(${red}, ${blue}, ${green})`;
    scatterWords();
    word.style.top = `${topValue}px`;
    word.style.left = `${leftValue}px`;
    randomBlink();
    word.style.animationDuration = `${animDuration}s`;
    container.appendChild(word);
  }
};
creatingWords();

//Detect window resizing
window.addEventListener('resize', creatingWords);
