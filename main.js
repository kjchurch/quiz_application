/** @format */

//Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qcount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullet(qcount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qcount);

      // Start CountDown  (timer)
      countdown(15, qcount);

      // Click On Submit
      submitButton.onclick = () => {
        // Git Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // increase index
        currentIndex++;

        checkAnswer(theRightAnswer, qcount);

        //Remove Previous Question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // Ad the next quetions
        addQuestionData(questionsObject[currentIndex], qcount);

        // Handle Bullets Classes
        handleBullets();

        // Start CountDown  (timer)
        clearInterval(countdownInterval);
        countdown(15, qcount);

        // show results
        showResults(qcount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullet(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("Span");

    // Check if it first Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Qestion
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class to main Div
      mainDiv.className = "answer";

      // Create Raido input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Date Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // // make first option Selected
      // if (i === 1) {
      //   radioInput.checked = true;
      // }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class = "good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Good</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">We Need More ! </span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "white";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
