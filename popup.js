document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  const hoursInput = document.getElementById("hours-input");
  const minutesInput = document.getElementById("minutes-input");
  const secondsInput = document.getElementById("seconds-input");
  const countdownList = document.getElementById("countdown-list");
  const addCountdownButton = document.getElementById("add-countdown");

  const alarmTimeInput = document.getElementById("alarm-time");
  const alarmList = document.getElementById("alarm-list");
  const addAlarmButton = document.getElementById("add-alarm");

  let activeCountdowns = {};

  // Tab switching
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.add("hidden"));

      tab.classList.add("active");
      tabContents[index].classList.remove("hidden");
      tabContents[index].classList.add("active");
    });
  });

  // Add Countdown
  addCountdownButton.addEventListener("click", () => {
    const hours = parseInt(hoursInput.value, 10) || 0;
    const minutes = parseInt(minutesInput.value, 10) || 0;
    const seconds = parseInt(secondsInput.value, 10) || 0;
    let totalTime = hours * 3600 + minutes * 60 + seconds;

    if (totalTime > 0) {
      const id = `countdown-${Date.now()}`;
      const li = document.createElement("li");
      li.id = id;
      li.innerHTML = `
        <span>${formatTime(totalTime)}</span>
        <button data-id="${id}" class="remove-countdown">Remove</button>
      `;
      countdownList.appendChild(li);

      // Start real-time updates for this countdown
      const interval = setInterval(() => {
        if (totalTime <= 0) {
          clearInterval(interval);
          alert("Countdown Finished!");
          li.remove();
          delete activeCountdowns[id];
        } else {
          totalTime -= 1;
          li.querySelector("span").textContent = formatTime(totalTime);
        }
      }, 1000);

      activeCountdowns[id] = interval;

      // Handle the Remove button
      li.querySelector(".remove-countdown").addEventListener("click", () => {
        clearInterval(interval);
        li.remove();
        delete activeCountdowns[id];
      });
    }
  });

  // Add Alarm
  addAlarmButton.addEventListener("click", () => {
    const alarmTime = alarmTimeInput.value;

    if (alarmTime) {
      const [hours, minutes] = alarmTime.split(":").map(Number);
      const now = new Date();
      const alarmDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
      );

      if (alarmDate < now) alarmDate.setDate(alarmDate.getDate() + 1);

      const id = `alarm-${Date.now()}`;
      const timeUntilAlarm = alarmDate.getTime() - now.getTime();

      const li = document.createElement("li");
      li.id = id;
      li.innerHTML = `
        <span>${alarmTime}</span>
        <button data-id="${id}" class="remove-alarm">Remove</button>
      `;
      alarmList.appendChild(li);

      const timeout = setTimeout(() => {
        alert("Alarm Ringing!");
        li.remove();
        delete activeCountdowns[id];
      }, timeUntilAlarm);

      activeCountdowns[id] = timeout;

      // Handle the Remove button
      li.querySelector(".remove-alarm").addEventListener("click", () => {
        clearTimeout(timeout);
        li.remove();
        delete activeCountdowns[id];
      });
    }
  });

  // Format time
  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }
});
