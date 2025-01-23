document.addEventListener("DOMContentLoaded", () => {
  chrome.alarms.get(
    "userAlarm",
    (alarms) => {
      const hasAlarm = !!alarms;
      updateButtonVisible(hasAlarm);
    }
  )
});

document.getElementById("timeInputH").addEventListener("input", (event) => {
  const value = event.target.value;
  if (value.length === 2) {
    event.target.value = value.replace(":", ""); // Remove ':' from input
    document.getElementById("timeInputM").focus(); // Focus on minutes input
  }
});

document.getElementById("setAlarm").addEventListener("click", () => {
  const timeInputH = document.getElementById("timeInputH").value;
  const timeInputM = document.getElementById("timeInputM").value;
  // const timeInputS = document.getElementById("timeInputS").value;

  // Validate and parse hh:mm:ss target time
  const timeParts = [timeInputH,timeInputM,'00'];
  if (timeParts.length !== 3) {
    alert("Please enter time in hh:mm format.");
    return;
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  if (
    isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
    hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60
  ) {
    alert("Invalid time format. Please use hh:mm.");
    return;
  }

  // Get the current time
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, seconds, 0);

  // Check if the target time is in the future
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  // Calculate delay in seconds
  const delayInSeconds = Math.ceil((targetTime - now) / 1000);

  chrome.alarms.create("userAlarm", { delayInMinutes: delayInSeconds / 60 });

  updateButtonVisible(true);

  window.close();
});

document.getElementById("cancelAlarm").addEventListener("click", () => {
  // Cancel the alarm
  chrome.alarms.clear("userAlarm", (wasCleared) => {
    if (wasCleared) {
      // alert("Alarm canceled.");
    } else {
      alert("No active alarm to cancel.");
    }
  });

  // Hide the cancel button
  updateButtonVisible(false);
});

function updateButtonVisible(alarmSet) {
  document.getElementsByClassName("input-container")[0].style.display = alarmSet ? "none" : "flex";
  document.getElementById("setAlarm").style.display = alarmSet ? "none" : "unset";

  document.getElementById("cancelAlarm").style.display = alarmSet ? "unset" : "none";
  document.getElementById("curr-alarm-container").style.display = alarmSet ? "unset" : "none";
}
