// Interactive Flashcard
document.querySelectorAll('.flashcard').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// Utility: get flashcards from localStorage
function getFlashcards() {
  return JSON.parse(localStorage.getItem("flashcards")) || [];
}

// Utility: save flashcards to localStorage
function saveFlashcards(cards) {
  localStorage.setItem("flashcards", JSON.stringify(cards));
}

// Example function: add a flashcard
function addFlashcard(question, answer) {
  const flashcards = getFlashcards();

  // Create flashcard object
  const newCard = {
    id: Date.now().toString(), // unique ID
    question: question,
    answer: answer
  };

  flashcards.push(newCard);
  saveFlashcards(flashcards);
  console.log("Flashcard saved:", newCard);
}

// Demo: Save a sample flashcard on button click
document.getElementById("btnSaveSet")?.addEventListener("click", () => {
  addFlashcard(
    "What is Active Recall?",
    "A study technique that boosts retention by retrieving information from memory."
  );
  alert("Flashcard saved to localStorage!");
});

// Debug: view saved flashcards in console
function showFlashcards() {
  const flashcards = getFlashcards();
  console.log("📚 Your saved flashcards:", flashcards);
}

// Retrieve flashcards from localStorage
function loadFlashcards() {
  let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

  const library = document.getElementById("flashcard-library");
  library.innerHTML = ""; // Clear previous entries before rendering

  flashcards.forEach(card => {
    // Create the flashcard element
    const flashcard = document.createElement("div");
    flashcard.classList.add("flashcard");

    flashcard.innerHTML = `
      <div class="flashcard-face front">
        <div class="flashcard-content">
          <span>${card.question}</span>
          <br><br>
          <small class="hint">Answer is on the flip side ↩</small>
        </div>
      </div>
      <div class="flashcard-face back">
        <span>${card.answer}</span>
      </div>
    `;

    // Add click-to-flip functionality
    flashcard.addEventListener("click", () => {
      flashcard.classList.toggle("flipped");
    });

    library.appendChild(flashcard);
  });
}

// Run this once when the page loads
document.addEventListener("DOMContentLoaded", loadFlashcards);

function renderFlashcards(limit = 5) {
  const libraryGrid = document.getElementById("libraryGrid");
  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

  libraryGrid.innerHTML = ""; // clear grid

  const flashcardsToShow = limit ? flashcards.slice(0, limit) : flashcards;

  flashcardsToShow.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "col flashcard-fade"; // apply fade class
    cardDiv.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${card.question}</h5>
          <p class="card-text">${card.answer}</p>
        </div>
      </div>
    `;
    libraryGrid.appendChild(cardDiv);

    // Staggered fade-in (delay by index)
    setTimeout(() => {
      cardDiv.classList.add("show");
    }, index * 100); // 100ms delay between each card
  });

  // Update button text
  const toggleBtn = document.getElementById("toggleFlashcards");
  if (toggleBtn) {
    if (limit && flashcards.length > limit) {
      toggleBtn.style.display = "inline-block";
      toggleBtn.textContent = "Show More";
    } else if (!limit) {
      toggleBtn.style.display = "inline-block";
      toggleBtn.textContent = "Show Less";
    } else {
      toggleBtn.style.display = "none"; // hide if ≤5 flashcards
    }
  }
}

