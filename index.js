// facts from https://facts.net/science/technology/rocket-facts/
let facts = [
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
];

let minTiltDifferenceX = 2;
let minTiltDifferenceY = 5;

let actualBeta = 0;
let actualGamma = 0;

let betaStandard = 0;
let gammaStandard = 0;

let rocketOffsetY = 30;
let scrollOffsetY = 100;

let up = true;

window.addEventListener("load", function() {
	window.scrollTo(0,0);
}, false)

window.addEventListener("deviceorientation", async function(event) {
	const rocketElement = document.getElementById("rocket_div");

	calibrateDeviceOrientation(event.beta, event.gamma);

	setFactPopup(rocketElement);

	updateRocket(rocketElement);

	let scrollDirection = getScrollDirection(rocketElement);
	if (scrollDirection != 0) await updateScroll(scrollDirection);
}, true);

function calibrateDeviceOrientation(beta, gamma) {
	actualBeta = beta - betaStandard;
	actualGamma = gamma - gammaStandard;
	document.getElementById("info").innerHTML = "<br> actualBeta = " + actualBeta
}

function calibrate() {
	betaStandard = actualBeta;
	gammaStandard = actualGamma;
}

function setFactPopup(rocketElement) {
	const popup = document.getElementById("fact_popup");
	const buttons = Array.from(document.getElementsByClassName("fact"));

	let rocketBounding = rocketElement.getBoundingClientRect();

	let rocketCenterX = rocketBounding.x + rocketBounding.width / 2;
	let rocketCenterY = rocketBounding.y + rocketBounding.height / 2;

	let rocketOnButtonIndex;
	for (let i = 0; i < buttons.length; i++) {
		const buttonBounding = buttons[i].getBoundingClientRect();

		if (buttonBounding.x < rocketCenterX && rocketCenterX < (buttonBounding.x + buttonBounding.width)) {
			if (buttonBounding.y < rocketCenterY && rocketCenterY < (buttonBounding.y + buttonBounding.height)) {
				rocketOnButtonIndex = i;
				break;
			}
		}
	}

	//set popup
	if (rocketOnButtonIndex === undefined) {
		popup.classList.add("hide");
		popup.classList.remove("show");
	} else {
		let text = document.getElementById("fact_text");
		text.innerHTML = facts[rocketOnButtonIndex];
		popup.classList.add("show");
		popup.classList.remove("hide");
	}
}

function updateRocket(rocketElement) {
	let rocketBounding = rocketElement.getBoundingClientRect()

	updateRocketImage();

	if (Math.abs(actualGamma) > minTiltDifferenceX) {
		updateRocketPositionX(rocketElement, rocketBounding);
	}

	if (Math.abs(actualBeta) > minTiltDifferenceY) {
		updateRocketPositionY(rocketElement, rocketBounding);
	}
}

function updateRocketImage() {
	const rocketImage = document.getElementById("rocket_image");

	let oldImagePath = rocketImage.getAttribute("src");
	let newImagePath = "";

	if (Math.abs(actualBeta) > minTiltDifferenceY) {
		up = actualBeta < -minTiltDifferenceY;
	}

	if (actualGamma > minTiltDifferenceX) {
		if (up) {
			newImagePath = "images/rocket_directions/rocket_fire_up_right.png";
		} else {
			newImagePath = "images/rocket_directions/rocket_fire_down_right.png";
		}
	} else {
		if (up) {
			newImagePath = "images/rocket_directions/rocket_fire_up_left.png";
		} else {
			newImagePath = "images/rocket_directions/rocket_fire_down_left.png";
		}
	}

	if (oldImagePath != newImagePath && newImagePath != "") {
		rocketImage.setAttribute("src", newImagePath);
	}
}

function updateRocketPositionX(rocketElement, rocketBounding) {
	let newPositionLeft = rocketElement.offsetLeft + parseInt(actualGamma) / 2;
	let maxPositionLeft = window.innerWidth - rocketBounding.width;

	if (newPositionLeft < 0) newPositionLeft = 0;
	else if (newPositionLeft > maxPositionLeft) newPositionLeft = maxPositionLeft;

	rocketElement.style.left = newPositionLeft + "px";
}

function updateRocketPositionY(rocketElement, rocketBounding) {
	let newPositionTop = rocketElement.offsetTop + parseInt(actualBeta) / 2;
	let maxPositionTop = document.documentElement.clientHeight - rocketBounding.height - rocketOffsetY;

	if (newPositionTop < rocketOffsetY) newPositionTop = rocketOffsetY;
	else if (newPositionTop > maxPositionTop) newPositionTop = maxPositionTop;

	rocketElement.style.top = newPositionTop + "px";
}

async function updateScroll(scrollDirection) {
	let maxStep = Math.sign(scrollDirection) * 50;

	let documentHeight = Math.max(
		document.body.offsetHeight,
		document.body.scrollHeight,
		document.body.clientHeight,
		document.documentElement.offsetHeight,
		document.documentElement.scrollHeight,
		document.documentElement.clientHeight,
	);
	let maxScrollY = documentHeight - document.documentElement.clientHeight;

	let nextScrollY = window.pageYOffset + maxStep;

	if (nextScrollY < 0) nextScrollY = 0;
	else if (nextScrollY > maxScrollY) nextScrollY = maxScrollY;

	if (scrollDirection < 0) {
		for (let i = window.pageYOffset; i > nextScrollY; i--) {
			await sleep(1);
			window.scrollTo({
				top: i,
				behavior: 'smooth'
			});
		}
	} else {
		for (let i = window.pageYOffset; i < nextScrollY; i++) {
			await sleep(1);
			window.scrollTo({
				top: i,
				behavior: 'smooth'
			});
		}
	}
}

function sleep(ms) {
	return new Promise(res => {
		setTimeout(() => res(), ms);
	})
}

function getScrollDirection(rocketElement) {
	let rocketBounding = rocketElement.getBoundingClientRect();

	// for browser compatibility
	let documentHeight = Math.max(
		document.body.offsetHeight,
		document.body.scrollHeight,
		document.body.clientHeight,
		document.documentElement.offsetHeight,
		document.documentElement.scrollHeight,
		document.documentElement.clientHeight,
	);
	let maxPositionTop = document.documentElement.clientHeight - rocketBounding.height - rocketOffsetY;
	let maxScrollY = documentHeight - document.documentElement.clientHeight;

	let isAtTop = rocketElement.offsetTop < rocketOffsetY + scrollOffsetY;
	let isAtBottom = rocketElement.offsetTop > maxPositionTop - scrollOffsetY;

	let canScrollUp = window.pageYOffset > 0;
	let canScrollDown = window.pageYOffset < maxScrollY;

	if (isAtTop && canScrollUp && up) return -1;
	else if (isAtBottom && canScrollDown && !up) return 1;
	else return 0;
}