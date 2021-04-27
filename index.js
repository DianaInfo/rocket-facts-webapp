// facts from https://facts.net/science/technology/rocket-facts/
var facts = [
	"NASA has launched a total of 166 manned rockets to space missions.",
	"Rockets have been used in space travel for over 70 years.",
	"NASA rockets cost $500 million to build and launch.",
	"China has launched more rockets than any country in the world.",
	"There are 4 types of rockets: solid-fuel, liquid fuel, ion, and plasma rockets.",
	"The Saturn V rockets were the most successful rockets ever launched.",
	"Rockets have reached the farthest known place from Earth.",
	"There is a comic character named Rocket.",
	"Huntsville, Alabama is known as Rocket City.",
	"A rocket caused the first space-related death.",
	"Rockets are extremely hot.",
	"Rockets launch in 3 stages."
]

window.addEventListener("load", function() {
	window.scrollTo(0,0)
}, false)

var startPositionChecked = false
var minTiltDifferenceX = 1
var minTiltDifferenceY = 5
var tiltBackStart = -5
var tiltForwardStart = 5
var startAngle = 0
var startScrollIncrement = 5
var scrollIncrement = startScrollIncrement
var inertia = 5
var scrollPosition = window.pageYOffset

var up = true
var right = true
var doCalibrate = true

var betaStandard = 0
var gammaStandard = 0

window.addEventListener("deviceorientation", function(event) {
	var beta = event.beta
	var gamma = event.gamma

	if (doCalibrate) {
		betaStandard = beta
		gammaStandard = gamma
		doCalibrate = false
	}


	if (!startPositionChecked) {
		startAngle = beta
		tiltBackStart = startAngle - minTiltDifferenceY
		tiltForwardStart = startAngle + minTiltDifferenceY

		startPositionChecked = true
	}

	updateImage(beta, gamma)

	var rocketElement = document.getElementById("rocket_div")
	var rocketBounding = rocketElement.getBoundingClientRect()

	updateRocketPositionX(gamma)
	updateRocketPositionY(beta)

	document.querySelector("#mag").innerHTML = "alpha = " + event.alpha
		+ "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma
		+ "<br>" + "scrollPosition = " + scrollPosition

	setFactPopup(rocketBounding)

}, true);

updateImage = function(beta, gamma) {
	var rocketImage = document.querySelector("#rocket_image")
	var oldImagePath = rocketImage.getAttribute("src")
	var newImagePath = ""

	if (beta < tiltBackStart || beta > tiltForwardStart) {
		up = beta < tiltBackStart
	}
	if (gamma < -minTiltDifferenceX || gamma > minTiltDifferenceX) {
		right = gamma > minTiltDifferenceX
	}

	if(up) {
		if (right) {
			newImagePath = "images/rocket_directions/rocket_fire_up_right.png"
		} else {
			newImagePath = "images/rocket_directions/rocket_fire_up_left.png"
		}
	} else {
		if (right) {
			newImagePath = "images/rocket_directions/rocket_fire_down_right.png"
		} else {
			newImagePath = "images/rocket_directions/rocket_fire_down_left.png"
		}
	}

	if (oldImagePath != newImagePath && newImagePath != "") {
		rocketImage.setAttribute("src", newImagePath)
	}
}

updateRocketPositionX = function(gamma) {
	// Frage: wird es stockend die Bewegung, wenn ja zurück ändern
	if (gamma < -minTiltDifferenceX || gamma > minTiltDifferenceX) {
		var oldPositionLeft = rocketElement.offsetLeft
		var maxPositionLeft = window.innerWidth - rocketBounding.width
		var newPositionLeft = oldPositionLeft + gamma

		if (newPositionLeft < 0) newPositionLeft = 0
		else if (newPositionLeft > maxPositionLeft) newPositionLeft = maxPositionLeft

		if (newPositionLeft != null){
			rocketElement.style.left = newPositionLeft + "px"
		}
	}
}

setFactPopup = function(rocketBounding) {
	var buttons = Array.from(document.getElementsByClassName("fact"))
	buttons.sort(function(a,b) {
		return parseInt(a.innerHTML) - parseInt(b.innerHTML)
	})

	for (let i = 0; i < buttons.length; i++) {
		var popup = document.getElementById("fact_popup");

		const buttonBounding = buttons[i].getBoundingClientRect()
		var rocketCenterX = rocketBounding.x + 1/2 * rocketBounding.width
		var rocketCenterY = rocketBounding.y + 1/2 * rocketBounding.height

		buttonBoundingXOnWindow = buttonBounding.y - window.scrollY;
		if (buttonBounding.x < rocketCenterX && rocketCenterX < (buttonBounding.x + buttonBounding.width)) {
			if (buttonBoundingXOnWindow < rocketCenterY && rocketCenterY < (buttonBoundingXOnWindow + buttonBounding.height)) {
				var text = document.getElementById("fact_text")
				text.innerHTML = facts[i]
				if (!popup.classList.contains("show")) popup.classList.add("show")
				break;
			} else {
				popup.classList.remove("show")
			}
		} else {
			popup.classList.remove("show")
		}
	};
}

updateRocketPositionY = function(beta) {
	if (beta > tiltForwardStart) {
		scrollPosition = Math.min(document.body.clientHeight, scrollPosition + scrollIncrement)
	} else if (beta < tiltBackStart) {
		scrollPosition = Math.max(0, scrollPosition - scrollIncrement)
	} else {
		scrollIncrement = startScrollIncrement
	}

	window.scrollTo(0, scrollPosition)
}

calibrate = function() {
	doCalibrate = true
}