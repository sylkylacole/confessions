console.log("Connected");

// Import everything via id & classes

const confessButton = document.getElementById("confess-button-1");
const buttonsClass = document.getElementsByClassName("buttons");
const confessingClass = document.getElementsByClassName("confessing");
const confessionSubmit = document.getElementById("confess-submit");

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
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});


// Add event listener for submitting form

const form = document.querySelector("#confession-form");

form.onsubmit = function (e) {
  const text = textarea.value.trim();

  if (text === "") {
    e.preventDefault();
    alert("Empty confessions not allowed.");
    return;
  };

  if (text.length < 100) {
    e.preventDefault();
    alert("Confession is too short. Suspicious.");
    return;
  };
};

/* Create event for when confession is submitted, it hides the confess button and shows the view and browse button */