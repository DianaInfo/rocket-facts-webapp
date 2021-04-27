window.addEventListener("load", function() {
	window.scrollTo(0,0)
}, false)

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

var minTiltDifferenceX = 2
var minTiltDifferenceY = 5

var up = true
var right = true
var doCalibrate = true

var betaStandard = 0
var gammaStandard = 0

var scrollOffset = 200

window.addEventListener("deviceorientation", function(event) {
	var beta = event.beta
	var gamma = event.gamma

	if (doCalibrate) {
		betaStandard = beta
		gammaStandard = gamma
		doCalibrate = false
	}

	beta = beta - betaStandard
	gamma = gamma - gammaStandard

	var popup = document.getElementById("fact_popup");

	var factToShow = rocketOnButton()
	if (factToShow != -1) {
		var text = document.getElementById("fact_text")
		text.innerHTML = facts[factToShow]
		popup.classList.add("show")
		popup.classList.remove("hide")
	} else {
		popup.classList.add("hide")
		popup.classList.remove("show")
	}

	if (Math.abs(beta) > minTiltDifferenceY) {
		up = beta < -minTiltDifferenceY
	}
	if (Math.abs(gamma) > minTiltDifferenceX) {
		right = gamma > minTiltDifferenceX
	}

	updateImage()

	updateRocketPositionY(beta)
	updateRocketPositionX(gamma)
}, true);

updateImage = function() {
	var rocketImage = document.querySelector("#rocket_image")
	var oldImagePath = rocketImage.getAttribute("src")
	var newImagePath = ""

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

updateRocketPositionY = function(beta) {
	var rocketElement = document.getElementById("rocket_div")
	var rocketBounding = rocketElement.getBoundingClientRect()

	var oldPositionTop = rocketElement.offsetTop
	var maxPositionTop = window.innerHeight - rocketBounding.height

	adjustWindowScroll(newPositionTop)

	if (Math.abs(beta) > minTiltDifferenceY) {
		var diffY = parseInt(beta) / 2
		var newPositionTop = oldPositionTop + diffY

		if (newPositionTop < 0) newPositionTop = 0
		else if (newPositionTop > maxPositionTop) newPositionTop = maxPositionTop

		if (newPositionTop != null){
			rocketElement.style.top = newPositionTop + "px"
		}
	}
}

adjustWindowScroll = function(newPositionTop) {
	var documentHeight = Math.max(
		document.body.offsetHeight,
		document.body.scrollHeight,
		document.body.clientHeight,
		document.documentElement.offsetHeight,
		document.documentElement.scrollHeight,
		document.documentElement.clientHeight,
	);

	var maxScrollY = documentHeight - document.documentElement.clientHeight

	var currentScrollY = window.pageYOffset
	var offsetBottom = document.documentElement.clientHeight - scrollOffset

	var nextScrollY = currentScrollY

	var isAtTop = (newPositionTop < scrollOffset)
	var isAtBottom = (newPositionTop > offsetBottom)
	var canScrollUp = (currentScrollY > 0)
	var canScrollDown = (currentScrollY < offsetBottom)

	var maxStep = 50

	var str_intensity = ""
	if (isAtTop && canScrollUp) {
		var intensity = (scrollOffset - newPositionTop) / scrollOffset
		str_intensity = "intensity = " + intensity
		document.getElementById("info").innerHTML = "intensity = " + intensity
	} else if (isAtBottom && canScrollDown) {
		var intensity = (newPositionTop - offsetBottom) / scrollOffset
		str_intensity = "intensity = " + intensity
		nextScrollY = nextScrollY + (maxStep * intensity)
	}
	document.getElementById("info").innerHTML = "nextScrollY = " + nextScrollY + "<br>" + "intensity = " + str_intensity

	nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY))

	if (nextScrollY != currentScrollY) window.scrollTo(0, nextScrollY)
}

updateRocketPositionX = function(gamma) {
	var rocketElement = document.getElementById("rocket_div")
	var rocketBounding = rocketElement.getBoundingClientRect()

	var oldPositionLeft = rocketElement.offsetLeft
	var maxPositionLeft = window.innerWidth - rocketBounding.width

	if (Math.abs(gamma) > minTiltDifferenceX) {
		var newPositionLeft = oldPositionLeft + (parseInt(gamma)/2)

		if (newPositionLeft < 0) newPositionLeft = 0
		else if (newPositionLeft > maxPositionLeft) newPositionLeft = maxPositionLeft

		if (newPositionLeft != null){
			rocketElement.style.left = newPositionLeft + "px"
		}
	}
}

setFactPopup = function() {
	var rocketElement = document.getElementById("rocket_div")
	var rocketBounding = rocketElement.getBoundingClientRect()

	var buttons = Array.from(document.getElementsByClassName("fact"))
	buttons.sort(function(a,b) {
		return parseInt(a.innerHTML) - parseInt(b.innerHTML)
	})

	var isRocketOnAFact = false
	for (let i = 0; i < buttons.length; i++) {
		if (rocketOnFact == i) continue

		const buttonBounding = buttons[i].getBoundingClientRect()
		var rocketCenterX = rocketBounding.x + 1/2 * rocketBounding.width
		var rocketCenterY = rocketBounding.y + 1/2 * rocketBounding.height

		if (buttonBounding.x < rocketCenterX && rocketCenterX < (buttonBounding.x + buttonBounding.width)) {
			if (buttonBounding.y < rocketCenterY && rocketCenterY < (buttonBounding.y + buttonBounding.height)) {
				var popup = document.getElementById("fact_popup");
				isRocketOnAFact = true
				rocketOnFact = i
				var text = document.getElementById("fact_text")
				text.innerHTML = facts[i]
				popup.classList.remove("hide")
				popup.classList.add("show")
				break
			}
		}
	};
	if (!isRocketOnAFact) {
		rocketOnFact = -1
		popup.classList.remove("show")
		popup.classList.add("hide")
	}
}

rocketOnButton = function() {
	var rocketElement = document.getElementById("rocket_div")
	var rocketBounding = rocketElement.getBoundingClientRect()

	var buttons = Array.from(document.getElementsByClassName("fact"))
	buttons.sort(function(a,b) {
		return parseInt(a.innerHTML) - parseInt(b.innerHTML)
	})

	var rocketOnFact = -1
	for (let i = 0; i < buttons.length; i++) {
		const buttonBounding = buttons[i].getBoundingClientRect()
		var rocketCenterX = rocketBounding.x + 1/2 * rocketBounding.width
		var rocketCenterY = rocketBounding.y + 1/2 * rocketBounding.height

		if (buttonBounding.x < rocketCenterX && rocketCenterX < (buttonBounding.x + buttonBounding.width)) {
			if (buttonBounding.y < rocketCenterY && rocketCenterY < (buttonBounding.y + buttonBounding.height)) {
				isRocketOnAFact = true
				rocketOnFact = i
				break
			}
		}
	};

	return rocketOnFact
}

calibrate = function() {
	doCalibrate = true
}