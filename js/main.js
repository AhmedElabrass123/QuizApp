// Select Element
let questionCount = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".spansContainer");
let quizArea = document.querySelector(".quizArea");
let answersArea = document.querySelector(".answersArea");
let submitBtn = document.querySelector(".submitBtn");
let results = document.querySelector(".results");
let theCountDown = document.querySelector(".countDown");
// set options
let currentIndex = 0;
let rAnswers = 0;
let counter;
function getQuestions() {
  fetch("../html-question.json")
    .then((res) => res.json())
    .then((data) => {
      let numOfQ = data.length;
      createBullets(numOfQ);
      addQuestionData(data[currentIndex], numOfQ);
      //   count down
      countDown(5, numOfQ);
      submitBtn.onclick = () => {
        // get right answer
        let rightAnswer = data[currentIndex].right_answer;
        // IncreaseIndex
        currentIndex++;
        // check answer
        checkAnswer(rightAnswer, numOfQ);
        // remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(data[currentIndex], numOfQ);
        // handle spans classes
        handleSpans();
        // countDown
        clearInterval(counter);
        countDown(5, numOfQ);
        // show results
        showResults(numOfQ);
      };
    });
}

getQuestions();
function createBullets(num) {
  questionCount.innerHTML = num;
  //   create span
  for (let i = 1; i <= num; i++) {
    //create span
    let spanEle = document.createElement("span");
    //append span to spanContainer
    spansContainer.append(spanEle);
    //check if its first span
    if (i == 1) {
      spanEle.classList.add("on");
    }
  }
}

function addQuestionData(obj, numOfQ) {
  if (currentIndex < numOfQ) {
    //   create h2 question
    let quesTitle = document.createElement("h2");
    quesTitle.innerHTML = obj.title + "?";
    quizArea.append(quesTitle);
    //   create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      // create radio input
      let radioInput = document.createElement("input");
      // add type-name-dataAttribute-id
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // make first option select
      if (i == 1) {
        radioInput.checked = true;
      }
      // create label
      let theLabel = document.createElement("label");
      // add for attribute(htmlFor)
      theLabel.htmlFor = `answer_${i}`;
      // label text
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(labelText);
      // add label and input to the main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

// ====check answer function====
function checkAnswer(rightAnswer, num) {
  //   console.log(rightAnswer, num);
  let answers = document.getElementsByName("question");
  let chosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log(chosenAnswer);
  console.log(rightAnswer);
  if (chosenAnswer == rightAnswer) {
    rAnswers++;
    console.log("Good");
  }
}
function handleSpans() {
  const spans = document.querySelectorAll(".spansContainer span");
  let arrOfSpans = Array.from(spans);
  arrOfSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.classList.add("on");
    }
  });
}
function showResults(numOfQ) {
  let theResults;
  if (currentIndex == numOfQ) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bullets.remove();
    if (rAnswers > numOfQ / 2 && rAnswers < numOfQ) {
      theResults = `<span class="good">Good</span> , The right answers is ${rAnswers} from ${numOfQ}`;
    } else if (rAnswers == numOfQ) {
      theResults = `<span class="perfect">Perfect</span> , All answers is right.`;
    } else {
      theResults = `<span class="bad">Bad</span> , The right answers is ${rAnswers} from ${numOfQ}`;
    }
    results.innerHTML = theResults;
  }
}

function countDown(duration, numOfQ) {
  if (currentIndex < numOfQ) {
    counter = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes < 10 ? "0" + minutes : minutes;
      seconds < 10 ? "0" + seconds : seconds;

      theCountDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(counter);
        submitBtn.click();
        console.log("finished");
      }
    }, 1000);
  }
}
