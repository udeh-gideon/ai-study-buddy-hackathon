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
