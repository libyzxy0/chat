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
  let firstName = getVal("firstName");
  let lastName = getVal("lastName");
  let username = getVal("username");
  let password = getVal("password");
  let cpassword = getVal("cpassword");
  if (!username) {
    return showToast("Please fill up the username.");
  }
  if (!password) {
    return showToast("Please fill up the password");
  }
  if (!firstName) {
    return showToast("Please fill up your First Name");
  }
  if (!lastName) {
    return showToast("Please fill up your Last Name");
  }
  if(cpassword != password) {
    return showToast("Please confirm your password");
  }
  let response = await makePostRequest({ username, firstName, lastName, password }, "/auth/signup");
  if (response.code === 200) {
    showToast("Account Created, redirecting please wait...");
    setTimeout(() => {
      window.location.href = "/";
      form.reset()
    }, 1000);
  } else {
    showToast("Account Creation Failed");
    form.reset()
  }
});
