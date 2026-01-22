console.log("Connected");

// Import everything via id & classes

const confessButton = document.getElementById("confess-button-1");
const buttonsClass = document.getElementsByClassName("buttons");
const confessingClass = document.getElementsByClassName("confessing");
const confessionForm = document.getElementById("confess-submit");

// Build function to hide buttons class and display confessing class & add event listener to confessButton


confessButton.addEventListener("click", () => {
  document.querySelectorAll(".buttons").forEach(el => {
    el.classList.add("hidden");
  });
  document.querySelectorAll(".confessing").forEach(el => {
    el.classList.remove("hidden");
  });
  console.log("Confess button clicked");
});


const textarea = document.getElementById("confession");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";              // reset height
  textarea.style.height = textarea.scrollHeight + "px"; // grow
});


// Add event listener for submit button