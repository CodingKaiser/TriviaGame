$(document).ready(function() {
	var questions = [["<u>Complete the lyric</u>: Boys all in idle, left to their own devices open up your linen lap and let me go...", 0, ["Down, down, down", "Up, up, up", "To the Left, to the Left", "Let slip a ribbon down"], "<img src='assets/images/q1Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["<u>Complete the lyric</u>: These currents pull us 'cross the border, Steady your boats, Arms to shoulder...", 2, ["we'll build our walls aluminum", "we'll leave our tracks untraceable", "till tides will pull our hull aground", "we'll make our homes on the water"], "<img src='assets/images/q2Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["Which Park & Recreation actor was featured in a recent Decemberists music video?", 2, ["Amy Poehler", "Rashida Jones", "Nick Offerman", "Aziz Ansari"], "<img src='assets/images/q3Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["Lead singer Colin Meloy married Carson Ellis, who did <b>what</b> for the band?", 1, ["Managed the band in its infancy", "Draws the band's album art", "Served as the band's first drummer", "Having dated its bassist"], "<img src='assets/images/q4Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["<u>Complete the lyric</u>: But never once in the employ Of these holy men Did I ever once turn my mind from the thought of...", 3, ["Grizelda", "Lust", "You", "Revenge"], "<img src='assets/images/q5Image.gif' class='center-block question-graphic thumbnail'>"]
					];
	var delay;
	var timer;

	var game = {
		wins: 0,
		losses: 0,
		skipped: 0,
		maxSeconds: 30,
		secondsRemaining: 30,
		currentQuestionIndex: 0
	};

	function start() {
		resetGame();
		stageNextQuestion();
	};

	function resetGame() {
		game.wins = 0;
		game.losses = 0;
		game.skipped = 0;
		game.currentQuestionIndex = 0;
	};

	function clearGameArea() {
		$("#main-content-area").children().each(function() {
			$(this).remove();
		});
	};

	function stageNextQuestion() {
		clearInterval(timer);
		clearTimeout(delay);
		game.secondsRemaining = game.maxSeconds;
		clearGameArea();
		populateGameArea();
		hookUpClickHandlers();
		setUpTimer();
	};

	function populateGameArea() {
		$("#main-content-area").append("<h2 id='time-counter' class='text-center'>Time Remaining: " + game.secondsRemaining + " Seconds</h2>");
		$("#main-content-area").append("<h2 id='question' class='text-center'>" + getCurrentQuestion() + "</h2>");
		for (var i = 0; i < getCurrentQuestionAnswers().length; i++) {
			var answerDisplay = $("<h3></h3>");
			answerDisplay.attr("id", "answer" + i);
			answerDisplay.addClass("answer center-block");
			answerDisplay.text(getCurrentQuestionAnswers()[i]);
			$("#main-content-area").append(answerDisplay);
		}
	};

	function hookUpClickHandlers() {
		$("#main-content-area").children(".answer").each(function() {
			$(this).on("click", function() {
				goToAnswerScreen(true, $(this).attr("id"));
			});
		});
	};

	function goToAnswerScreen(userGaveAnswer, idOfAnswer) {
		clearGameArea();
		if (userGaveAnswer) {
			var answerIdDigit = parseInt(idOfAnswer[idOfAnswer.length-1]);
			if (answerIdDigit === getCurrentQuestionAnswerIndex()) {
				game.wins++;
				$("#main-content-area").append("<h3 class='text-center'>You Win!</h3>");
			} else {
				game.losses++;
				$("#main-content-area").append("<h3 class='text-center'>You Lose!</h3>");
				$("#main-content-area").append("<h3 class='text-center'>The correct answer was: '" + getCurrentQuestionAnswer() + "'</h3>");
			}
		} else {
			game.skipped++;
			$("#main-content-area").append("<h3 class='text-center'>Time ran out!</h3>");
			$("#main-content-area").append("<h3 class='text-center'>The correct answer was: '" + getCurrentQuestionAnswer() + "'</h3>");
		}
		$("#main-content-area").append(getCurrentQuestionGraphic());
		delay = setTimeout(nextQuestionOrFinishGame, 4000);
	}

	function nextQuestionOrFinishGame() {
		game.currentQuestionIndex++;
		if (game.currentQuestionIndex < questions.length) {
			stageNextQuestion();
		} else {
			finishGame();
		}
	}

	function finishGame() {
		clearGameArea();
		$("#main-content-area").append("<h2 class='text-center'>All done! Here's how you did:</h2>")
		$("#main-content-area").append("<h3 class='text-center'>Correct Answers: " + game.wins + "</h3>");
		$("#main-content-area").append("<h3 class='text-center'>Incorrect Answers: " + game.losses + "</h3>");
		$("#main-content-area").append("<h3 class='text-center'>Skipped Questions: " + game.skipped + "</h3>");
		$("#main-content-area").append("<button id='start-game-btn' type='button' class='btn btn-default center-block'>Restart Game</button>");
		$("#start-game-btn").click(start);
	}

	function getCurrentQuestion() {
		return questions[game.currentQuestionIndex][0];
	};

	function getCurrentQuestionAnswers() {
		return questions[game.currentQuestionIndex][2];
	};

	function getCurrentQuestionAnswerIndex() {
		return questions[game.currentQuestionIndex][1];
	};

	function getCurrentQuestionAnswer() {
		return getCurrentQuestionAnswers()[getCurrentQuestionAnswerIndex()];
	};

	function getCurrentQuestionGraphic() {
		return questions[game.currentQuestionIndex][3];
	}

	function setUpTimer() {
		timer = setInterval(decrementTime, 1000);
	};

	function decrementTime() {
		if (game.secondsRemaining <= 1) {
			clearInterval(timer);
			goToAnswerScreen(false, "");
		} else {
			game.secondsRemaining--;
			$("#time-counter").text("Time Remaining: " + game.secondsRemaining + " Seconds");
		}
	};

	$("#start-game-btn").on("click", function() {
		console.log("Start button started.");
		start();
	});
});