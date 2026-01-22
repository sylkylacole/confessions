console.log("Connected");

// Import the buttons and sections via id & classes

const confessButton = document.getElementById("confess-button-1");
const buttonsClass = document.getElementsByClassName("buttons");
const confessingClass = document.getElementsByClassName("confessing");

// Build function to hide buttons class and display confessing class

// function timeToConfess() {
//     console.log("Confess button clicked");
//     document.querySelectorAll(".buttons").forEach(el => {
//         el.classList.add("hidden");
//     });
// };

// Add event listener to confessButton

// confessButton.addEventListener("click", timeToConfess());

confessButton.addEventListener("click", () => {
  document.querySelectorAll(".buttons").forEach(el => {
    el.classList.add("hidden");
  });
  document.querySelectorAll(".confessing").forEach(el => {
    el.classList.remove("hidden");
  });
  console.log("Confess button clicked");
});