// Interactive Flashcard

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.flashcard').forEach(card => {
    // Toggle on click (desktop users)
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    // Toggle on touch (mobile users)
    card.addEventListener('touchend', () => {
      card.classList.toggle('flipped');
    });
  });
});
