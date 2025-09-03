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

// Integrating a delete button on flashcards rendered
function renderFlashcard(card) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col';
  colDiv.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${card.question}</h5>
        <p class="card-text flex-grow-1">${card.answer}</p>
        <div class="d-flex justify-content-end gap-2 mt-2">
          <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${card.id}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${card.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  return colDiv;
}

// Logic behind the delete feature
function displayFlashcards() {
  const libraryGrid = document.getElementById('libraryGrid');
  libraryGrid.innerHTML = ""; // clear grid first

  const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

  flashcards.forEach(card => {
    const cardEl = renderFlashcard(card);
    libraryGrid.appendChild(cardEl);
  });
}

// Event delegation for delete
document.getElementById('libraryGrid').addEventListener('click', (e) => {
  if (e.target.closest('.btn-delete')) {
    const cardId = e.target.closest('.btn-delete').dataset.id;
    deleteFlashcard(cardId);
  }
});

function deleteFlashcard(id) {
  let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  flashcards = flashcards.filter(card => card.id !== id);
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
  displayFlashcards(); // refresh the grid
  showToast("Flashcard deleted successfully!");
}

// Toast feedback
function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = toast.querySelector('.toast-msg');
  msg.textContent = message;

  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Initial render on load
document.addEventListener('DOMContentLoaded', displayFlashcards);

document.getElementById('libraryGrid').addEventListener('click', (e) => {
  // Delete
  if (e.target.closest('.btn-delete')) {
    const cardId = e.target.closest('.btn-delete').dataset.id;
    deleteFlashcard(cardId);
  }

  // Edit Flashcard
  if (e.target.closest('.btn-edit')) {
    const cardId = e.target.closest('.btn-edit').dataset.id;
    editFlashcard(cardId);
  }
});

function editFlashcard(id) {
  let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  const card = flashcards.find(c => c.id === id);
  if (!card) return;

  // Simple prompt version (later we can do a modal form)
  const newQuestion = prompt("Edit Question:", card.question);
  const newAnswer = prompt("Edit Answer:", card.answer);

  if (newQuestion && newAnswer) {
    card.question = newQuestion;
    card.answer = newAnswer;

    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    displayFlashcards();
    showToast("Flashcard updated successfully!");
  }
}
