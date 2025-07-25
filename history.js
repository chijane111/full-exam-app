const historyQuestions = [
  { question: "Who was the first President of Nigeria?", options: ["Nnamdi Azikiwe", "Tafawa Balewa", "Obafemi Awolowo", "Yakubu Gowon"], answer: "Nnamdi Azikiwe" },
  { question: "In what year did Nigeria gain independence?", options: ["1963", "1960", "1957", "1970"], answer: "1960" },
  { question: "Which country colonized Nigeria?", options: ["France", "Germany", "Britain", "Portugal"], answer: "Britain" },
  { question: "Who led the 1966 military coup in Nigeria?", options: ["Yakubu Gowon", "Aguiyi Ironsi", "Chukwuma Kaduna Nzeogwu", "Murtala Mohammed"], answer: "Chukwuma Kaduna Nzeogwu" },
  { question: "What was the name of Nigeria's civil war?", options: ["Biafran War", "African War", "Niger Conflict", "Nigerian Revolution"], answer: "Biafran War" },
  { question: "When did the Nigerian civil war start?", options: ["1960", "1966", "1967", "1970"], answer: "1967" },
  { question: "Who was Nigeria's military head of state in 1983?", options: ["Obasanjo", "Buhari", "Ibrahim Babangida", "Gowon"], answer: "Buhari" },
  { question: "Which region first sought secession in Nigeria?", options: ["Northern Region", "Western Region", "Mid-Western Region", "Eastern Region"], answer: "Eastern Region" },
  { question: "Which year was the amalgamation of Nigeria?", options: ["1900", "1914", "1922", "1930"], answer: "1914" },
  { question: "Who was the first Nigerian to become a governor-general?", options: ["Nnamdi Azikiwe", "Ahmadu Bello", "Obafemi Awolowo", "Tafawa Balewa"], answer: "Nnamdi Azikiwe" },
  { question: "Where was Lord Lugard from?", options: ["France", "Spain", "Germany", "Britain"], answer: "Britain" },
  { question: "Which year did Nigeria become a republic?", options: ["1959", "1960", "1963", "1979"], answer: "1963" },
  { question: "What was Nigeria's capital before Abuja?", options: ["Ibadan", "Kaduna", "Lagos", "Port Harcourt"], answer: "Lagos" }
];

let currentQuestion = 0;
let userAnswers = new Array(historyQuestions.length).fill(null);
let timeLeft = 20 * 60;
const LOCAL_KEY = "history_exam_progress";

function displayQuestion() {
  const q = historyQuestions[currentQuestion];
  document.getElementById("question-title").innerText = `Question ${currentQuestion + 1}:`;
  document.getElementById("question-text").innerText = q.question;

  const optionsHtml = q.options.map((opt, index) => {
    const isChecked = userAnswers[currentQuestion] === opt ? "checked" : "";
    return `<label><input type="radio" name="answer" value="${opt}" ${isChecked}> ${String.fromCharCode(65 + index)}. ${opt}</label><br>`;
  }).join("");

  document.getElementById("options").innerHTML = optionsHtml;

  document.getElementById("prev-btn").style.display = currentQuestion === 0 ? "none" : "inline-block";
  document.getElementById("next-btn").style.display = currentQuestion === historyQuestions.length - 1 ? "none" : "inline-block";
  document.getElementById("submit-btn").style.display = currentQuestion === historyQuestions.length - 1 ? "inline-block" : "none";

  saveProgress();
}

function nextQuestion() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    alert("Please select an answer before continuing.");
    return;
  }

  userAnswers[currentQuestion] = selectedOption.value;

  if (currentQuestion < historyQuestions.length - 1) {
    currentQuestion++;
    displayQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

function confirmSubmit() {
  closeModal();
  showScore();
  localStorage.removeItem(LOCAL_KEY);
}

function closeModal() {
  document.getElementById("confirm-modal").style.display = "none";
}

function showScore() {
  let score = 0;

  historyQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
      score++;
    }
  });

  const resultBox = document.getElementById("result");
  document.getElementById("exam-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";

  resultBox.innerHTML = `
    <h2>Exam Completed</h2>
    <p style="font-size: 20px;">You scored <strong>${score}</strong> out of <strong>${historyQuestions.length}</strong>.</p>
  `;
}

function autoSubmitExam() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    userAnswers[currentQuestion] = selectedOption.value;
  }
  showScore();
  localStorage.removeItem(LOCAL_KEY);
}

function saveProgress() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({
    answers: userAnswers,
    current: currentQuestion
  }));
}

function restoreProgress() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    userAnswers = data.answers;
    currentQuestion = data.current;
  }
}

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  const progressBar = document.getElementById('progress-bar');
  const warningMsg = document.getElementById('warning-message');
  const totalTime = timeLeft;
  let warningShown = false;

  const timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const percentLeft = (timeLeft / totalTime) * 100;
    progressBar.style.width = `${percentLeft}%`;

    if (percentLeft <= 20) progressBar.style.backgroundColor = 'red';
    else if (percentLeft <= 50) progressBar.style.backgroundColor = 'orange';
    else progressBar.style.backgroundColor = 'green';

    if (timeLeft === 300 && !warningShown) {
      warningMsg.style.display = 'block';
      warningShown = true;
      setTimeout(() => {
        warningMsg.style.display = 'none';
      }, 5000);
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSubmitExam();
    }

    timeLeft--;
  }, 1000);
}

document.getElementById("next-btn").onclick = nextQuestion;
document.getElementById("prev-btn").onclick = prevQuestion;

window.onload = function () {
  restoreProgress();
  displayQuestion();
  startTimer();
};
