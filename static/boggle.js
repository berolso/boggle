$("form").on("submit", submit);
let score = 0;
let timer = { begun: false, time: true, seconds: 5 };
$(".clock").text(timer.seconds);

async function submit(e) {
  e.preventDefault();
  if (!timer.begun) startTimer(timer.seconds);
  if (timer.time) {
    let guess = $("input").val();
    const checkResponse = await axios.get("/check", {
      params: { guess: guess },
    });
    showMessage(checkResponse.data.result, guess);
    updateScore(guess, checkResponse.data.result);
  }
  if (!timer.time) {
    $(".message").text("Time has expired");
  }
  $("input").val("");
}

function showMessage(response, guess) {
  $(".message").text(`${guess}: ${response}`);
}

function updateScore(guess, response) {
  console.log(response);
  if (response === "ok") {
    wordScore = guess.length;
    score += wordScore;
  }
  $(".score").text(score);
}

function startTimer(time) {
  timer.begun = true;
  let countDown = timer.seconds;
  setInterval(() => {
    if (timer.time) {
      $(".clock").text((countDown -= 1));
    }
  }, 1000);
  setTimeout(() => {
    timer.time = false;
    $(".message").text("Time has expired");
    gameOver();
  }, time * 1000);
}

async function gameOver() {
  let roundScore = parseInt($(".score").text());
  console.log(roundScore);
  let update = await axios.post("/update", { score: roundScore });
  console.log(update);
}
