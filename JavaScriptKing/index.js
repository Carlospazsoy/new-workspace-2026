const btnEl = document.querySelector(".btn");
const inputEl = document.getElementById("input");
const copyEl = document.querySelector(".fa-copy");
const alertEl = document.querySelector(".alert-container");
const inputTest = document.querySelector(".input-test")
// Ahora como le vas a dar funcionalidad a tu icono copy

copyEl.addEventListener("click", () => {
  // copyValue();
  copyPassword();
  if (inputEl.value) {
    alertEl.classList.remove("disable");
    setTimeout(() => {
      alertEl.classList.add("disable");
    }, 2000);
  }
});
btnEl.addEventListener("click", () => {
  console.log("i'm alive");
  createPassword();
});

function createPassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
  const passwordLength = 14;

  let password = "";
  for (let index = 0; index < passwordLength; index++) {
    const randomNum = Math.floor(Math.random() * chars.length);
    password = password + chars.substring(randomNum, randomNum + 1);
    console.log(randomNum, password);
  }
  inputEl.value = password;
  alertEl.innerText = password + " copied";
console.dir(inputEl);
}

function copyPassword(){
  navigator.clipboard.writeText(inputEl.value);
  inputEl.select();
  inputEl.setSelectionRange(0, 9999);
}


document.addEventListener("click", (event) => {
  console.log("Clic en:", event.target);
});

// document.addEventListener("input", (event) => {
//   if (event.target.matches("input, textarea")) {
//     console.log("Se escribió en:", event.target.value);
//   }
// });
document.addEventListener("input", (event) => {
  
    console.log("Se hizo :", event.target.value);
});

// document.addEventListener("pointermove", (event) => {
//   console.log("Posición:", event.clientX, event.clientY);
// });



/* async function copyValue() {
  const inputValue = inputEl.value;
  if (!inputValue) return;

  try {
    await navigator.clipboard.writeText(inputValue);

    console.log("Password copied");
  } catch (error) {
    console.error("Could not copy the password:", error);
  }
} */
