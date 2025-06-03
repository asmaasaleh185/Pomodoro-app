const settingBtn   = document.querySelector('.setting-btn');
const closeBtn     = document.querySelector('.close-btn');
const settingOverlay = document.querySelector('.setting');
let promodoroInput = document.querySelector('.input-with-arrows #pomodoro');
let longBreakInput = document.querySelector('.input-with-arrows #long-break');
let shortBreakInput = document.querySelector('.input-with-arrows #short-break');
let fontType = document.querySelectorAll('.font-options button.active');
let color = document.querySelector('.color-options input:checked');
let startBtn = document.querySelector('.start-btn');
let isRunnig = false;
const root = document.documentElement;
// console.log(color.value);


settingBtn.addEventListener('click', () => {
  settingOverlay.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  settingOverlay.classList.remove('open');
});

document.querySelectorAll('.timer-type li').forEach(element => {
    element.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.timer-type li.active').classList.remove('active');
        element.classList.add('active');
        let minutes;
        if (element.classList.contains('p-btn'))       minutes = parseInt(promodoroInput.value, 10);
        else if (element.classList.contains('s-btn'))  minutes = parseInt(shortBreakInput.value, 10);
        else                                           minutes = parseInt(longBreakInput.value, 10);
        updateTimeDisplay(minutes);
    });
});

document.querySelectorAll('.font-options button').forEach(element=> {
    element.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelector('.font-options button.active').classList.remove('active');
        element.classList.add('active');
  });
});


document.querySelectorAll('.input-with-arrows').forEach(element => {
    let input = element.querySelector('input');
    element.querySelector('.up').addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
    });
    element.querySelector('.down').addEventListener('click', () => {
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
            console.log(input.value);
        }
    });
});

const circle   = document.querySelector('.progress-ring__circle');
const radius   = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray  = circumference;
circle.style.strokeDashoffset = 0;

let totalSeconds = parseInt(promodoroInput.value, 10) * 60;
let timeLeft     = totalSeconds;
let timerInterval = null;
let isRunning     = false;

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimeDisplay(minutes){
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';
  }

  totalSeconds = minutes * 60;
  timeLeft     = totalSeconds;
  
  updateUI();

}

function updateUI() {
  document.getElementById('time-display').textContent = formatTime(timeLeft);
  const elapsed  = totalSeconds - timeLeft;
  const progress = elapsed / totalSeconds;
  const offset   = circumference * progress;
  circle.style.strokeDashoffset = offset;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.textContent = 'Pause';
  const activeTab = document.querySelector('.timer-type li.active').classList;
  let minutes;
  if (activeTab.contains('p-btn'))       minutes = parseInt(promodoroInput.value, 10);
  else if (activeTab.contains('s-btn')) minutes = parseInt(shortBreakInput.value, 10);
  else                                  minutes = parseInt(longBreakInput.value, 10);

  totalSeconds = minutes * 60;
  timeLeft     = totalSeconds;
  updateUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateUI();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.textContent = 'Start';
}

startBtn.addEventListener('click', () => {
  if (isRunning) pauseTimer();
  else           startTimer();
});

document.querySelector('.apply-btn').addEventListener('click', apply);

function apply(){
  const selectedColor = document.querySelector('.color-options input:checked');
  const selectedFontBtn = document.querySelector('.font-options button.active');
  root.style.setProperty('--first-color', selectedColor.value);
  document.body.setAttribute('data-font', selectedFontBtn.getAttribute('data-font'));
  settingOverlay.classList.remove('open');
}