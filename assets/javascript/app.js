$(document).ready(function() {
	var questions = [["<u>Complete the lyric</u>: Boys all in idle, left to their own devices open up your linen lap and let me go...", 0, ["Down, down, down", "Up, up, up", "To the Left, to the Left", "Let slip a ribbon down"], "<img src='assets/images/q1Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["<u>Complete the lyric</u>: These currents pull us 'cross the border, Steady your boats, Arms to shoulder...", 2, ["we'll build our walls aluminum", "we'll leave our tracks untraceable", "till tides will pull our hull aground", "we'll make our homes on the water"], "<img src='assets/images/q2Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["Which Park & Recreation actor was featured in a recent Decemberists music video?", 2, ["Amy Poehler", "Rashida Jones", "Nick Offerman", "Aziz Ansari"], "<img src='assets/images/q3Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["Lead singer Colin Meloy married Carson Ellis, who did <b>what</b> for the band?", 1, ["Managed the band in its infancy", "Draws the band's album art", "Served as the band's first drummer", "Having dated its bassist"], "<img src='assets/images/q4Image.gif' class='center-block question-graphic thumbnail'>"],
					 ["<u>Complete the lyric</u>: But never once in the employ Of these holy men Did I ever once turn my mind from the thought of...", 3, ["Grizelda", "Lust", "You", "Revenge"], "<img src='assets/images/q5Image.gif' class='center-block question-graphic thumbnail'>"]
					];
	var mainContentArea = $("#main-content-area");
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
		// Reset game stats
		game.wins = 0;
		game.losses = 0;
		game.skipped = 0;
		game.currentQuestionIndex = 0;
	};

	function clearGameArea() {
		// Remove all of the divs in the main content div
		mainContentArea.children().each(function() {
			$(this).remove();
		});
	};

	function stageNextQuestion() {
		// Clear intervals if any have been set
		clearInterval(timer);
		clearTimeout(delay);
		// Reset timer
		game.secondsRemaining = game.maxSeconds;
		clearGameArea();
		populateGameArea();
		hookUpClickHandlers();
		setUpTimer();
	};

	function populateGameArea() {
		mainContentArea.append("<h2 id='time-counter' class='text-center'>Time Remaining: " + 
										game.secondsRemaining + " Seconds</h2>");
		mainContentArea.append("<h2 id='question' class='text-center'>" + 
										getCurrentQuestion() + "</h2>");
		// Loop through questions and add them to the main content area
		for (var i = 0; i < getCurrentQuestionAnswers().length; i++) {
			var answerDisplay = $("<h3></h3>");
			answerDisplay.attr("id", "answer" + i);
			answerDisplay.addClass("answer center-block");
			answerDisplay.text(getCurrentQuestionAnswers()[i]);
			mainContentArea.append(answerDisplay);
		}
	};

	function hookUpClickHandlers() {
		// Clicking on answers takes user to next screen
		mainContentArea.children(".answer").each(function() {
			$(this).on("click", function() {
				goToAnswerScreen(true, $(this).attr("id"));
			});
		});
	};

	function goToAnswerScreen(userGaveAnswer, idOfAnswer) {
		clearGameArea();
		// If user gave answer, evaluate correctness.
		// Otherwise, tally up 'skipped' count
		if (userGaveAnswer) {
			var answerIdDigit = parseInt(idOfAnswer[idOfAnswer.length-1]);
			if (answerIdDigit === getCurrentQuestionAnswerIndex()) {
				playerGaveCorrectAnswer();
			} else {
				playerGaveWrongAnswer();
			}
		} else {
			playerSkippedQuestion();
		}
		mainContentArea.append(getCurrentQuestionGraphic());
		delay = setTimeout(nextQuestionOrFinishGame, 4000);
		clearInterval(timer);
	}

	function playerGaveCorrectAnswer() {
		game.wins++;
		(new Audio('assets/sounds/victory.wav')).play();
		mainContentArea.append("<h3 class='text-center'>You Win!</h3>");
	}

	function playerGaveWrongAnswer() {
		(new Audio('assets/sounds/defeat.wav')).play();
		game.losses++;
		mainContentArea.append("<h3 class='text-center'>You Lose!</h3>");
		mainContentArea.append("<h3 class='text-center'>The correct answer was: '" + getCurrentQuestionAnswer() + "'</h3>");
	}

	function playerSkippedQuestion() {
		(new Audio('assets/sounds/outatime.wav')).play();
		game.skipped++;
		mainContentArea.append("<h3 class='text-center'>Time ran out!</h3>");
		mainContentArea.append("<h3 class='text-center'>The correct answer was: '" + getCurrentQuestionAnswer() + "'</h3>");
	}

	function nextQuestionOrFinishGame() {
		game.currentQuestionIndex++;
		// If at end of quiz, go to 'finish game' screen
		if (game.currentQuestionIndex < questions.length) {
			stageNextQuestion();
		} else {
			finishGame();
		}
	}

	function finishGame() {
		clearGameArea();
		// Display summary stats in main content area
		mainContentArea.append("<h2 class='text-center'>All done! Here's how you did:</h2>")
		mainContentArea.append("<h3 class='text-center'>Correct Answers: " + game.wins + "</h3>");
		mainContentArea.append("<h3 class='text-center'>Incorrect Answers: " + game.losses + "</h3>");
		mainContentArea.append("<h3 class='text-center'>Skipped Questions: " + game.skipped + "</h3>");
		mainContentArea.append("<button id='start-game-btn' type='button' class='btn btn-default center-block'>Restart Game</button>");
		// Give player option to restart game
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
			$("#time-counter").text("Time Remaining: " + 
									game.secondsRemaining + " Seconds");
		}
	};

	$("#start-game-btn").on("click", function() {
		console.log("Start button started.");
		start();
	});
});