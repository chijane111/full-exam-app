const questions = [
      { text: "What modify a noun or pronoun?", options: { A: "Adverb", B: "Verb", C: "Adjective", D: "Conjuction" }, correct: "C" },
      { text: "What does antonym means?", options: { A: "Similar", B: "Opposite", C: "Same", D: "Together" }, correct: "B" },
      { text: "Which word is a synonym of 'happy'?", options: { A: "Angry", B: "Joyful", C: "Sad", D: "Bitter" }, correct: "B" },
      { text: "Choose the correctly punctuated sentence:", options: { A: "I went to the market, and bought apples.", B: "I went to the market and, bought apples.", C: "I went to the market and bought apples.", D: "I went to the market and bought, apples." }, correct: "C" },
      { text: "Identify the adjective in the sentence: 'She wore a beautiful dress to the party.'", options: { A: "She", B: "Dress", C: "Beautiful", D: "Party" }, correct: "C" },
      { text: "Which of the following is a compound sentence?", options: { A: "I ran.", B: "I ran because I was late.", C: "I ran, and I fell.", D: "Running late, I hurried." }, correct: "C" },
      { text: "Which word is an antonym of 'generous'?", options: { A: "Giving", B: "Mean", C: "Kind", D: "Noble" }, correct: "B" },
      { text: "Choose the correct spelling:", options: { A: "Accomodation", B: "Acommodation", C: "Accommodation", D: "Acomodation" }, correct: "C" },
      { text: "What is the plural form of 'child'?", options: { A: "Childs", B: "Children", C: "Childes", D: "Childrens" }, correct: "B" },
      { text: "Choose the sentence in passive voice:", options: { A: "She painted the picture.", B: "The picture was painted by her.", C: "She was painting the picture.", D: "She is painting the picture." }, correct: "B" },
      { text: "Which tense is used in this sentence: 'He has finished his homework'?", options: { A: "Past Tense", B: "Future Perfect", C: "Present Perfect", D: "Present Continuous" }, correct: "C" },
      { text: "What is the function of the word 'quickly' in this sentence: 'He ran quickly'?", options: { A: "Verb", B: "Noun", C: "Adjective", D: "Adverb" }, correct: "D" }
    ];

    let currentQuestion = 0;
let score = 0;
let timeLeft = 20 * 60;
let warningShown = false;
const userAnswers = new Array(questions.length).fill(null);

function loadQuestion(index) {
  const q = questions[index];
  document.getElementById('question-title').textContent = `Question ${index + 1}:`;
  document.getElementById('question-text').textContent = q.text;
  document.getElementById('options-container').innerHTML = Object.entries(q.options).map(([key, value]) => {
    const checked = userAnswers[index] === key ? 'checked' : '';
    return `<label><input type="radio" name="answer" value="${key}" ${checked}> ${key}. ${value}</label><br>`;
  }).join('');

  document.getElementById('prev-btn').style.display = index > 0 ? 'inline-block' : 'none';
  document.getElementById('next-btn').style.display = index < questions.length - 1 ? 'inline-block' : 'none';
  document.getElementById('submit-btn').style.display = index === questions.length - 1 ? 'inline-block' : 'none';
}

document.getElementById('next-btn').onclick = () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return alert("Please select an answer.");
  userAnswers[currentQuestion] = selected.value;
  currentQuestion++;
  loadQuestion(currentQuestion);
};

document.getElementById('prev-btn').onclick = () => {
  currentQuestion--;
  loadQuestion(currentQuestion);
};

document.getElementById('exam-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected) userAnswers[currentQuestion] = selected.value;
  document.getElementById('confirm-modal').style.display = 'flex';
});

function confirmSubmit() {
  closeModal();
  score = userAnswers.reduce((total, ans, i) => ans === questions[i].correct ? total + 1 : total, 0);
  document.getElementById('exam-form').style.display = 'none';
  document.getElementById('question-title').textContent = 'Exam Completed!';
  document.getElementById('question-text').textContent = '';
  document.getElementById('result').innerHTML = `<h3>Your score is ${score} out of ${questions.length}.</h3>`;
}

function closeModal() {
  document.getElementById('confirm-modal').style.display = 'none';
}

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  const progressBar = document.getElementById('progress-bar');
  const warningMsg = document.getElementById('warning-message');
  const totalTime = timeLeft;

  const timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const percentLeft = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentLeft}%`;
    progressBar.style.backgroundColor = percentLeft <= 20 ? 'red' : percentLeft <= 50 ? 'orange' : 'green';

    if (timeLeft === 300 && !warningShown) {
      warningMsg.style.display = 'block';
      warningShown = true;
      setTimeout(() => warningMsg.style.display = 'none', 5000);
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      confirmSubmit();
    }

    timeLeft--;
  }, 1000);
}

loadQuestion(currentQuestion);
startTimer();