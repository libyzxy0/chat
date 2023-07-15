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
      loader(1);
    }
  });
};
function showToast(text) {
  document.getElementById("toast").style.visibility = "visible";
  document.getElementById("toast").style.opacity = "1";
  document.getElementById("toast-text").textContent = text;
  setTimeout(() => {
    document.getElementById("toast").style.visibility = "hidden";
    document.getElementById("toast_text").textContent = "";
    document.getElementById("toast").style.opacity = "0";
  }, 2000);
}


const btn = document.getElementById('show-tc');
const modal = document.getElementById('terms-conditions');
btn.addEventListener('click', () => {
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
})

document.getElementById('hide-modal').addEventListener('click', () => {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
})
document.getElementById('decline-tc').addEventListener('click', () => {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
})
document.getElementById('accept-tc').addEventListener('click', () => {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
})

const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let getVal = (id) => document.getElementById(id).value;
  let username = getVal("username");
  let password = getVal("password");
  if (!username) {
    return showToast("Please fill up username.");
  }
  if (!password) {
    return showToast("Please fill up password");
  }
  let response = await makePostRequest({ username, password }, "/auth/login");
  if (response.code === 200) {
    showToast("Successfully logged in, redirecting please wait...");
    setTimeout(() => {
      window.location.href = "/";
      form.reset()
    }, 1000);
  } else if (response.code == 400) {
    showToast("Incorrect Password");
  } else if (response.code == 404) {
    showToast("User not found!");
  } else {
    showToast("Login Failed");
  }
});
