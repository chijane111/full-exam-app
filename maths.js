const mathsQuestions = [
      { question: "What is 5 + 7?", options: ["10", "11", "12", "13"], answer: "12" },
      { question: "What is the square of 9?", options: ["81", "18", "27", "36"], answer: "81" },
      { question: "What is 15 divided by 3?", options: ["3", "5", "6", "7"], answer: "5" },
      { question: "What is the product of 4 and 6?", options: ["24", "30", "18", "20"], answer: "24" },
      { question: "What is 100 minus 45?", options: ["55", "65", "45", "75"], answer: "55" },
      { question: "What is the value of 2²?", options: ["2", "4", "6", "8"], answer: "4" },
      { question: "How many sides does a triangle have?", options: ["3", "4", "5", "6"], answer: "3" },
      { question: "What is the next prime number after 7?", options: ["8", "9", "10", "11"], answer: "11" },
      { question: "What is half of 50?", options: ["20", "25", "30", "40"], answer: "25" },
      { question: "What is 9 x 8?", options: ["72", "81", "64", "69"], answer: "72" },
      { question: "Which of these is an even number?", options: ["11", "13", "14", "15"], answer: "14" },
      { question: "What is the square root of 36?", options: ["5", "6", "7", "8"], answer: "6" },
      { question: "How many hours are there in 2 days?", options: ["24", "36", "48", "72"], answer: "48" }
    ];

    let currentQuestion = 0;
    let userAnswers = new Array(mathsQuestions.length).fill(null);
    let timeLeft = 20 * 60; // 20 minutes
    const LOCAL_KEY = "math_exam_progress";

    function displayQuestion() {
      const q = mathsQuestions[currentQuestion];
      document.getElementById("question-title").innerText = `Question ${currentQuestion + 1}:`;
      document.getElementById("question-text").innerText = q.question;

      const optionsHtml = q.options.map((opt, index) => {
        const isChecked = userAnswers[currentQuestion] === opt ? "checked" : "";
        return `<label><input type="radio" name="answer" value="${opt}" ${isChecked}> ${String.fromCharCode(65 + index)}. ${opt}</label><br>`;
      }).join("");

      document.getElementById("options").innerHTML = optionsHtml;

      document.getElementById("back-btn").style.display = currentQuestion === 0 ? "none" : "inline-block";
      document.getElementById("next-btn").innerText = currentQuestion === mathsQuestions.length - 1 ? "Submit" : "Next";

      saveProgress();
    }

    function nextQuestion() {
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      if (!selectedOption) {
        alert("Please select an answer before continuing.");
        return;
      }

      userAnswers[currentQuestion] = selectedOption.value;

      if (currentQuestion < mathsQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
      } else {
        document.getElementById("confirm-modal").style.display = "flex";
      }

      saveProgress();
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
      mathsQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
          score++;
        }
      });

      document.getElementById("exam-box").style.display = "none";
      document.getElementById("result-box").style.display = "block";
      document.getElementById("score-text").innerText = `You scored ${score} out of ${mathsQuestions.length}`;
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

        if (timeLeft === 300 && !warningShown) {
          warningMsg.style.display = 'block';
          warningShown = true;
          setTimeout(() => {
            warningMsg.style.display = 'none';
          }, 5000);
        }

        const percentLeft = (timeLeft / totalTime) * 100;
        progressBar.style.width = `${percentLeft}%`;

        if (percentLeft <= 20) {
          progressBar.style.backgroundColor = 'red';
        } else if (percentLeft <= 50) {
          progressBar.style.backgroundColor = 'orange';
        } else {
          progressBar.style.backgroundColor = 'green';
        }

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          autoSubmitExam();
        }

        timeLeft--;
      }, 1000);
    }

    window.onload = function () {
      restoreProgress();
      displayQuestion();
      startTimer();
    };