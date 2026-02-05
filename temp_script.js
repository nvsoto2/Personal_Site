//script.js

let slideIndex = [1,1,1,1];
let slideId = ["mySlides", "show_2", "show_3", "show_4"]
let dotId = ["dot", "dot_2", "dot_3", "dot_4"]
showSlides(1,0);
showSlides(1,1);
showSlides(1,2);
showSlides(1,3);

let slideTimer = setInterval(() => {
	autoAdvance();
}, 2000);

function autoAdvance() {
	for (let i = 0; i < slideId.length; i++) {
		if( document.getElementsByClassName(slideId[i]).length >0) {
			showSlides(slideIndex[i] += 1, i);
		}
	}
}

//Next/previous controls
function plusSlides(n, no) {
	clearInterval(slideTimer)
	showSlides(slideIndex[no] += n, no);
	slideTimer = setInterval(autoAdvance, 4000);
}

// Thumbnail image controls
function currentSlide(n, no) {
	clearInterval(slideTimer);
	showSlides(slideIndex[no] = n, no);
	slideTimer = setInterval(autoAdvance, 4000);
}

function showSlides(n, no) {
	let i;
	let x = document.getElementsByClassName(slideId[no]);
	let dots = document.getElementsByClassName(dotId[no]);
	if (n > x.length) {slideIndex[no] = 1;}
	if (n < 1) {slideIndex[no] = x.length;}
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	x[slideIndex[no]-1].style.display = "block";
	if (dots.length >0) {
		dots[slideIndex[no]-1].className += " active";
	}
}