// Shared client script for index.html and browse.html

const confessButton = document.getElementById("confess-button-1");
const confessionForm = document.querySelector("#confession-form");
const textarea = document.getElementById("confession");
const fileInput = document.getElementById("confession-attachment");
const viewButton = document.getElementById("view-button");
const confessionsList = document.getElementById("confessions-list");

function toggleConfessForm(show) {
  document.querySelectorAll(".buttons").forEach((el) => {
    el.classList.toggle("hidden", show);
  });
  document.querySelectorAll(".confessing").forEach((el) => {
    el.classList.toggle("hidden", !show);
  });
}

if (confessButton) {
  confessButton.addEventListener("click", () => {
    toggleConfessForm(true);
  });
}

if (textarea) {
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
}

async function submitConfession(message, imageFile) {
  const formData = new FormData();
  formData.append("message", message);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch("/api/confessions", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit confession.");
  }

  return response.json();
}

if (confessionForm) {
  confessionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = textarea.value.trim();
    const imageFile = fileInput.files[0];

    if (!message) {
      return alert("Please enter your confession before submitting.");
    }
    if (message.length < 10) {
      return alert("Confession must be at least 10 characters.");
    }

    try {
      const result = await submitConfession(message, imageFile);
      console.log("Confession submitted:", result);
      alert("Confession submitted successfully!");
      toggleConfessForm(false);
      textarea.value = "";
      if (fileInput) {
        fileInput.value = "";
      }
      if (viewButton) {
        viewButton.classList.remove("hidden");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

function renderConfession(confession, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "browse-confession";

  const image = document.createElement("img");
  image.className = "browse-confess-pic";
  image.alt = "Confession image";
  image.src = confession.image_url || "https://placehold.co/150x150";
  wrapper.appendChild(image);

  const heading = document.createElement("h3");
  heading.className = "browse-id-number";
  heading.textContent = `#${index + 1}`;
  wrapper.appendChild(heading);

  const text = document.createElement("p");
  text.className = "browse-confession-text";
  text.textContent = confession.message;
  wrapper.appendChild(text);

  const dateLabel = document.createElement("p");
  dateLabel.className = "confession-date";
  dateLabel.textContent = new Date(confession.created_at).toLocaleString();
  wrapper.appendChild(dateLabel);

  return wrapper;
}

async function loadConfessions() {
  if (!confessionsList) return;

  try {
    const response = await fetch("/api/confessions");
    const items = await response.json();

    confessionsList.innerHTML = "";

    if (!items.length) {
      confessionsList.innerHTML = "<p>No confessions posted yet.</p>";
      return;
    }

    items.forEach((item, index) => {
      confessionsList.appendChild(renderConfession(item, index));
    });
  } catch (error) {
    console.error(error);
    confessionsList.innerHTML = "<p>Failed to load confessions. Please refresh.</p>";
  }
}

if (confessionsList) {
  loadConfessions();
}
