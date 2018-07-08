var data;
var score = 0;

function loadByButtonNumber(oldState, buttonNumber, scoreChange) {
	let nextState = data[oldState].options[buttonNumber].next;
	let state = nextState;
	if (Array.isArray(nextState)) {
		state = nextState[0].state;
		for (s of nextState) {
			if (s.hasOwnProperty("min") && s.hasOwnProperty("max")) {
				if (s.min <= score && s.max >= score) {
					state = s.state;
				}
			}
		}
	}
	load(state, scoreChange);
}

function load(key, scoreChange) {
	if (scoreChange === "reset") {
		score = 0;
	} else {
		score += scoreChange;
	}
	document.getElementById("background-back").style.backgroundImage = document.getElementById("background-front").style.backgroundImage;
	document.getElementById("background-front").classList.remove('animate');
	document.getElementById("background-front").style.opacity = 0;
	updateElements(key);
	setTimeout(function () {
		document.getElementById("background-front").classList.add('animate');
		document.getElementById("background-front").style.opacity = 1;
	}, 100);
}

function updateElements(key) {
	let state = data[key];
	recreateButtons(key, state.options);
	document.getElementById("background-front").style.backgroundImage = "url('images/" + state.image + "')";
	document.getElementById("text").innerHTML = state.text;
	document.getElementById("question").innerHTML = state.question;
}

function recreateButtons(currentState, buttons) {
	let html = "";
	let buttonNumber = 0;
	for (btn of buttons) {
		let score = wrapScore(btn.score);
		html += "<button class='" + btn.class + "' onclick='loadByButtonNumber(\"" + currentState + "\", " + buttonNumber + ", " + score + ")'>" + btn.text + "</button> ";
		buttonNumber++;
	}
	document.getElementById("buttons").innerHTML = html;
}

function wrapScore(score) {
	if (score === "reset") {
		return "\"reset\"";
	} else {
		return score;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			load("start", 0);
		}
	};
	xhttp.open("GET", "data/data.json", true);
	xhttp.send();
});
