class Boggle {
  constructor() {
    $("form").on("submit", this.submit.bind(this));
    this.score = 0;
    this.timer = { begun: false, time: true, seconds: 3 };
    $(".clock").text(this.timer.seconds);
  }
  async submit(e) {
    e.preventDefault();
    if (!this.timer.begun) this.startTimer(this.timer.seconds);
    if (this.timer.time) {
      let guess = $("input").val();
      const checkResponse = await axios.get("/check", {
        params: { guess: guess },
      });
      this.showMessage(checkResponse.data.result, guess);
      this.updateScore(guess, checkResponse.data.result);
    }
    if (!this.timer.time) {
      $(".message").text("Time has expired");
    }
    $("input").val("");
  }

  showMessage(response, guess) {
    $(".message").text(`${guess}: ${response}`);
  }

  updateScore(guess, response) {
    console.log(response);
    if (response === "ok") {
      let wordScore = guess.length;
      this.score += wordScore;
    }
    $(".score").text(this.score);
  }

  startTimer(time) {
    this.timer.begun = true;
    let countDown = this.timer.seconds;
    setInterval(() => {
      if (this.timer.time) {
        $(".clock").text((countDown -= 1));
      }
    }, 1000);
    setTimeout(() => {
      this.timer.time = false;
      $(".message").text("Time has expired");
      this.gameOver();
    }, time * 1000);
  }

  async gameOver() {
    let roundScore = parseInt($(".score").text());
    let update = await axios.post("/update", { score: roundScore });
  }
}

let boggle = new Boggle();
