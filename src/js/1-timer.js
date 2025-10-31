// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";





const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
}

let userSelectedDate = null;
let timerId = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate  = selectedDates[0];
    if(userSelectedDate <= new Date()){
        iziToast.error({
            title: "Error",
            message: "Please choose a date in the future",
            position: "topRight",
        })
        refs.startBtn.disabled = true;
        return;
    }
    refs.startBtn.disabled = false;
    
},

};
flatpickr(refs.input, options);


function addTime (value){
    const time = String(value).padStart(2, "0");
    return time;
}

function updateTimerUI(days, hours, minutes, seconds) {
    refs.days.textContent = addTime(days);
    refs.hours.textContent = addTime(hours);
    refs.minutes.textContent = addTime(minutes);
    refs.seconds.textContent = addTime(seconds);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

refs.startBtn.addEventListener("click", () => {

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;


    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerUI(0, 0, 0, 0);
      refs.input.disabled = false; 
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    updateTimerUI(days, hours, minutes, seconds);


  }, 1000);
});










