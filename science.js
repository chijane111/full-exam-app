const scienceQuestions = [
      { question: "Which part of the plant carries out photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"], answer: "Leaf" },
      { question: "What gas do humans breathe in?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], answer: "Oxygen" },
      { question: "Which organ pumps blood through the body?", options: ["Lungs", "Brain", "Heart", "Liver"], answer: "Heart" },
      { question: "What do we use to see things?", options: ["Ears", "Nose", "Eyes", "Hands"], answer: "Eyes" },
      { question: "Water boils at what temperature (°C)?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" },
      { question: "What is H₂O?", options: ["Oxygen", "Hydrogen", "Salt", "Water"], answer: "Water" },
      { question: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars" },
      { question: "Which sense organ is used for hearing?", options: ["Eye", "Ear", "Nose", "Skin"], answer: "Ear" },
      { question: "What do bees produce?", options: ["Milk", "Honey", "Juice", "Sugar"], answer: "Honey" },
      { question: "Which of these is a solid?", options: ["Air", "Water", "Ice", "Steam"], answer: "Ice" },
      { question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Brain"], answer: "Skin" },
      { question: "How many legs does an insect have?", options: ["4", "6", "8", "10"], answer: "6" },
      { question: "What force pulls objects down to Earth?", options: ["Magnetism", "Friction", "Gravity", "Electricity"], answer: "Gravity" }
    ];

    let currentQuestion = 0;
    let userAnswers = new Array(scienceQuestions.length).fill(null);
    let timeLeft = 20 * 60;
    const LOCAL_KEY = "science_exam_progress";

    function displayQuestion() {
      const q = scienceQuestions[currentQuestion];
      document.getElementById("question-title").innerText = `Question ${currentQuestion + 1}:`;
      document.getElementById("question-text").innerText = q.question;

      const optionsHtml = q.options.map((opt, index) => {
        const isChecked = userAnswers[currentQuestion] === opt ? "checked" : "";
        return `<label><input type="radio" name="answer" value="${opt}" ${isChecked}> ${String.fromCharCode(65 + index)}. ${opt}</label><br>`;
      }).join("");

      document.getElementById("options").innerHTML = optionsHtml;

      document.getElementById("back-btn").style.display = currentQuestion === 0 ? "none" : "inline-block";
      document.getElementById("next-btn").innerText = currentQuestion === scienceQuestions.length - 1 ? "Submit" : "Next";

      saveProgress();
    }

    function nextQuestion() {
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      if (!selectedOption) {
        alert("Please select an answer before continuing.");
        return;
      }

      userAnswers[currentQuestion] = selectedOption.value;

      if (currentQuestion < scienceQuestions.length - 1) {
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
      scienceQuestions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) {
          score++;
        }
      });

      document.getElementById("exam-box").style.display = "none";
      document.getElementById("result-box").style.display = "block";
      document.getElementById("score-text").innerText = `You scored ${score} out of ${scienceQuestions.length}`;
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