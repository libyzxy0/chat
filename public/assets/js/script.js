/*
 * © Copyright 2023 libyzxy0, All Rights Reserved.
 * Please put a credits if you copy this code!
 */

let messageForm = document.getElementById("messageForm");
let container = document.getElementById("messages-body");
let banner = document.querySelector(".banner");
let newChat = document.getElementById("new-chat");


function getLocation() {

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log(latitude, longitude);
      makePostRequest({ latitude, longitude }, "/api/userlocation")
    }, (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          //alert("Please turn on your location.")
          break;
        case error.POSITION_UNAVAILABLE:
          // Location information unavailable
          break;
        case error.TIMEOUT:
          // Request timed out
          break;
        case error.UNKNOWN_ERROR:
          // Unknown error occurred
          break;
      }
    });
  }
}

function loader(q) {
  if (q == 1) {
    setTimeout(() => {
      var preloader = document.querySelector(".preloader");
      preloader.style.visibility = "visible";
      preloader.style.opacity = "1";
    }, 1000);
  } else {
    setTimeout(() => {
      var preloader = document.querySelector(".preloader");
      preloader.style.visibility = "hidden";
      preloader.style.opacity = "0";
    }, 1000);
  }
}
loader(1);
function scrollToMaxHeight() {
  // Get the maximum height of the page
  const maxHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

  // Scroll to the maximum height
  window.scrollTo({
    top: maxHeight,
    behavior: 'smooth' // You can change this to 'auto' if you prefer an instant scroll
  });
}
const makePostRequest = async (data, endpoint) => {
  return new Promise(async (resolve, reject) => {
    const sent = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    try {
      const response = await sent.json();
      resolve(response);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};


makePostRequest({}, "/api/user-info").then((data) => {
  document.getElementById("nav-name").textContent = data.firstName;
  document.getElementById("banner-name").textContent = "Helloo " + data.firstName + " " + data.lastName;
});

function processSystemData(data) {
  console.log(data.body)
  let her = document.createElement("li");
  if (data.attachments.type == "msg") {
    her.setAttribute("class", "herchat");
    her.textContent = data.body;
    container.appendChild(her);
  } else if (data.attachments.type == "video") {
    her.setAttribute("class", "herchat-attachment");
    let video = document.createElement("video");
    video.setAttribute("controls", true);
    let source = document.createElement("source");
    source.setAttribute("src", data.attachments.url);
    video.appendChild(source);
    her.appendChild(video);
    container.appendChild(her);
  } else if (data.attachments.type == "audio") {
    her.setAttribute("class", "herchat-attachment");
    let audio = document.createElement("audio");
    audio.setAttribute("controls", true);
    let source = document.createElement("source");
    source.setAttribute("src", data.attachments.url);
    audio.appendChild(source);
    her.appendChild(audio);
    container.appendChild(her);
  } else if (data.attachments.type == "image") {
    her.setAttribute("class", "herchat-attachment");
    let image = document.createElement("img");
    image.setAttribute("src", data.attachments.url);
    her.appendChild(image);
    container.appendChild(her);
  }
}
function processUserData(data) {
  let me = document.createElement("li");
  me.setAttribute("class", "mychat");
  me.textContent = data.body;
  container.appendChild(me);
}

(async function() {
  setTimeout(() => {
    loader(0);
    getLocation();
  }, 2000)
  let data = await makePostRequest({}, '/api/get-thread-data');
  let userInfo = await makePostRequest({}, '/api/user-info');
  loader(0);
  if (data.find(({ user }) => user.userID === userInfo.username)) {
    container.style.display = "block";
    banner.style.display = "none";
    newChat.style.display = "block";
  }
  // Retrieve thread data
  for (let i = 0; i < data.length; i++) {
    if (data[i].user !== undefined) {
      processUserData(data[i].user);
    }
    if (data[i].system !== undefined) {
      processSystemData(data[i].system);
    }
  }


})();


newChat.addEventListener("click", () => {
  window.location.href = '/api/clear';
});

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  container.style.display = "block";
  banner.style.display = "none";
  newChat.style.display = "block";
  let message = document.getElementById("message").value;
  let threadTempData = {};
  let me = document.createElement("li");
  me.setAttribute("class", "mychat");
  me.textContent = message;
  container.appendChild(me);
  messageForm.reset();
  let userInfo = await makePostRequest({}, "/api/user-info");
  let res = await makePostRequest({ message }, "/api/chat");
  threadTempData["user"] = {
    body: message,
    attachments: {},
    messageID: Math.random().toString(36).substr(2, 9),
    userID: userInfo.username
  };
  let result = {
    body: res.body,
    attachments: res.attachments,
    messageID: Math.random().toString(36).substr(2, 9),
    systemID: userInfo.username
  };
  threadTempData["system"] = result;
  processSystemData(result);

  makePostRequest(threadTempData, '/api/push-thread').then((res) => {
    console.log('Thread saved to server!')
  })
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  let msg = document.getElementById("message");
  msg.value = transcript;
};

document.getElementById("voice").addEventListener("click", () => {
  recognition.start();
});

document.onkeydown = function(e) {
  if (event.keyCode == 123) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    return false;
  }

  if (e.ctrlKey && e.shiftKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }
};
//Preloader
/*
window.addEventListener('load', function() {
  //loader(0)
});
*/
