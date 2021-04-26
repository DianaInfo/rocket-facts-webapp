window.ondevicemotion = function(event) { 
	var ax = event.accelerationIncludingGravity.x
	var ay = event.accelerationIncludingGravity.y
	var az = event.accelerationIncludingGravity.z

	document.querySelector("#acc").innerHTML = "X = " + ax + "<br>" + "Y = " + ay + "<br>" + "Z = " + az;
}

window.addEventListener("deviceorientation", function(event) {
	var beta = event.beta
	var gamma = event.gamma

	document.querySelector("#mag").innerHTML = "alpha = " + event.alpha + "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma;

	var rocketElement = document.querySelector("#rocket_div")
	var oldPositionTop = rocketElement.getAttribute("top")
	var oldPositionLeft = rocketElement.getAttribute("left")

	var rocketImage = document.querySelector("#rocket_image")
	var image_path = "images/rocket_directions/rocket_fire_top_right"
	if(beta > 0 && gamma > 0) {
		image_path = "images/rocket_directions/rocket_fire_down_right"
	} else if(beta > 0 && gamma < 0) {
		image_path = "images/rocket_directions/rocket_fire_down_left"
	} else if(beta < 0 && gamma < 0) {
		image_path = "images/rocket_directions/rocket_fire_top_left"
	}

	rocketImage.setAttribute("src", image_path)

	var newPositionTop = oldPositionTop + beta
	var newPositionLeft = oldPositionLeft + gamma

	rocketElement.setAttribute("top", newPositionTop)
	rocketElement.setAttribute("left", newPositionLeft)
}, true);