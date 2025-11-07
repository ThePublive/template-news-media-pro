const questions = document.querySelectorAll('.faq-pair-html');
// Iterate through each question element
questions.forEach((question) => {
  // Get the question and answer elements
  const questionText = question.querySelector('.question-html');
  const answer = question.querySelector('.answer-html');

  // Add a click event listener to each question
  questionText.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the answer
    question.classList.toggle('active');
    // Toggle the visibility of the answer by changing its display property
    answer.classList.toggle('active-answer-html');
  });
});