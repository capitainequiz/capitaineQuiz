let currentQuestion = 0;
let score = 0;
let questions = [];
let timer = 0;
let timerInterval;

const successSound = new Audio('public/success.wav');
const errorSound = new Audio('public/error.mp3');

document.getElementById('start-button').addEventListener('click', startQuiz);

function startQuiz() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    fetchQuizFromAPI();
    startTimer();
}

async function fetchQuizFromAPI() {
    try {
        const response = await fetch('/api/generate-quiz', { method: 'POST' });
        questions = await response.json();
        currentQuestion = 0;
        score = 0;
        showQuestion();
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz :', error);
        alert('Impossible de charger les questions.');
    }
}

function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = `Temps : ${timer}s`;
    }, 1000);
}

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').innerText = q.question;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.innerText = answer;
        btn.className = 'answer-button';
        btn.onclick = () => checkAnswer(index, btn);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, button) {
    disableButtons();

    if (selectedIndex === questions[currentQuestion].correct) {
        button.style.backgroundColor = 'green';
        score++;
        successSound.play();
    } else {
        button.style.backgroundColor = 'red';
        errorSound.play();
        highlightCorrectAnswer();
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
}

function disableButtons() {
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach(btn => btn.disabled = true);
}

function highlightCorrectAnswer() {
    const buttons = document.querySelectorAll('.answer-button');
    const correctIndex = questions[currentQuestion].correct;
    buttons[correctIndex].style.backgroundColor = 'green';
}
function endQuiz() {
    clearInterval(timerInterval);

    document.getElementById('quiz-area').innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score : ${score} / ${questions.length}</p>
        <p>Temps : ${timer}s</p>
        <a href="/">Rejouer</a>
        <div style="margin-top: 20px;">
            <p>Retrouve-nous sur YouTube :</p>
            <a href="https://www.youtube.com/@Capitaine_quiz" target="_blank">👉 Ma Chaîne YouTube</a>
        </div>
    `;
}
