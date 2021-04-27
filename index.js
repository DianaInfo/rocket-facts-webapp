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

var lastMovedTimeInMilliSec = new Date().getTime()

window.onload = function() {
	window.scrollTo(0,0)
}

window.ondevicemotion = function(event) {
	var ax = event.accelerationIncludingGravity.x
	var ay = event.accelerationIncludingGravity.y
	var az = event.accelerationIncludingGravity.z

	document.querySelector("#acc").innerHTML = "X = " + ax + "<br>" + "Y = " + ay + "<br>" + "Z = " + az
}

window.addEventListener("deviceorientation", function(event) {
	var beta = event.beta
	var gamma = event.gamma

	document.querySelector("#mag").innerHTML = "alpha = " + event.alpha + "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma

	var rocketImage = document.querySelector("#rocket_image")
	var image_path = "images/rocket_directions/rocket_fire_up_right.png"
	if(beta > 0 && gamma > 0) {
		image_path = "images/rocket_directions/rocket_fire_down_right.png"
	} else if(beta > 0 && gamma < 0) {
		image_path = "images/rocket_directions/rocket_fire_down_left.png"
	} else if(beta < 0 && gamma < 0) {
		image_path = "images/rocket_directions/rocket_fire_up_left.png"
	}

	rocketImage.setAttribute("src", image_path)

	var rocketElement = document.getElementById("rocket_div")
	var oldPositionTop = rocketElement.offsetTop
	var oldPositionLeft = rocketElement.offsetLeft

	document.querySelector("#old_positions").innerHTML = "top = " + oldPositionTop + "<br>" + "left = " + oldPositionLeft

	var rocketBounding = rocketElement.getBoundingClientRect()

	var newPositionTop = oldPositionTop + beta
	var newPositionLeft = oldPositionLeft + gamma

	var maxPositionLeft = window.innerWidth - rocketBounding.width

	if (newPositionLeft < 0) newPositionLeft = 0
	else if (newPositionLeft > maxPositionLeft) newPositionLeft = maxPositionLeft

	if (newPositionTop != null) {
		var scrollByY = beta
		if (Math.abs(beta) > 50) scrollByY = Math.sign(beta) * 100
		else if(Math.abs(beta) > 30) scrollByY = Math.sign(beta) * 50
		else if(Math.abs(beta) > 10) scrollByY = Math.sign(beta) * 20
		window.scrollBy(0, scrollByY)
	}
	if (newPositionLeft != null){
		rocketElement.style.left = newPositionLeft + "px"
	}

	var buttons = Array.from(document.getElementsByClassName("fact"))
	buttons.sort(function(a,b) {
		return parseInt(a.innerHTML) - parseInt(b.innerHTML)
	})

	var timeInMilliSec = new Date().getTime()
	if (timeInMilliSec - lastMovedTimeInMilliSec > 1000) {
		lastMovedTimeInMilliSec = timeInMilliSec
		for (let i = 0; i < buttons.length; i++) {
			var popup = document.getElementById("fact_popup");

			const buttonBounding = buttons[i].getBoundingClientRect()
			var rocketCenterX = rocketBounding.x + 1/2 * rocketBounding.width
			var rocketCenterY = rocketBounding.y + 1/2 * rocketBounding.height

			buttonBoundingXOnWindow = buttonBounding.y - window.scrollY;
			if (buttonBounding.x < rocketCenterX < (buttonBounding.x + buttonBounding.width)) {
				if (buttonBoundingXOnWindow < rocketCenterY < (buttonBoundingXOnWindow + buttonBounding.height)) {
					var text = document.getElementById("fact_text")
					text.innerHTML = facts[i]
					popup.classList.add("show")
					break;
				} else {
					popup.classList.remove("show")
				}
			} else {
				popup.classList.remove("show")
			}
		};
	}
}, true);