chrome.runtime.onStartup.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "userAlarm") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Simple Alarm",
      message: "Time's up!"
    });
    chrome.action.setBadgeText({ text: "" });
  }
});

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  const isEven = secs % 2 === 0;

  if (seconds >= 60) {
    return `${hrs}${isEven ? " " : ":"}${mins}`;
  }

  chrome.action.setBadgeTextColor({color: isEven? '#FF0000' : '#000000'})
  return `${secs}`;
}

function updateBadgeTime() {
  chrome.alarms.get("userAlarm", (alarm) => {
    if (alarm) {
      const remainingTime = Math.ceil((alarm.scheduledTime - Date.now()) / 1000); // Seconds
      if (remainingTime > 0) {
        const formattedTime = formatTime(remainingTime);
        chrome.action.setBadgeText({ text: formattedTime });
      } else {
        chrome.action.setBadgeText({ text: "" });
      }
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  });
}

setInterval(updateBadgeTime, 1000);