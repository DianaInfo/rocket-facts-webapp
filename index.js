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
	var oldPositionTop = rocketElement.offsetTop;
	var oldPositionLeft = rocketElement.offsetLeft;

	document.querySelector("#old_positions").innerHTML = "top = " + oldPositionTop + "<br>" + "left = " + oldPositionLeft;

	var newPositionTop = oldPositionTop + beta
	var newPositionLeft = oldPositionLeft + gamma

	if (newPositionTop != null) {
		rocketElement.style.top = newPositionTop + "px"
	}
	if (newPositionLeft != null){
		rocketElement.style.left = newPositionLeft + "px"
	}
}, true);