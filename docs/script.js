// Interactive flashcard for both desktop and mobile users
document.querySelectorAll('.flashcard').forEach(card => {
  card.addEventListener('click', 'touchend', () => {
    card.classList.toggle('flipped');
  });
});