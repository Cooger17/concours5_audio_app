import {songs} from './js/songs.js';

const body = document.body;
const audio = document.getElementById("audio");
const progressDiv = document.querySelector(".progress-bar")
const progressBar = document.querySelector(".progress");
const progressCircle = document.querySelector(".progress-circle");
const playPauseBtn = document.getElementById("play-pause-btn");
const tracker = document.getElementsByClassName("tracker");
const time = tracker[0].getElementsByTagName("span");
const shuffleBtn = document.getElementById("shuffleBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const volumeUpBtn = document.getElementById("volume-up");
const volumeDown = document.getElementById("volume-down");
const volumeBar = document.getElementById("volume-bar")
const volumeLevel = document.getElementsByClassName("volume-level")[0]
const volumeCircle = document.getElementsByClassName("volume-circle")[0]
let songTitle = document.getElementsByClassName("song-title")[0]
let singerName = document.getElementsByClassName("singer-name")[0]
let albumImg = document.getElementsByClassName("album-img")[0].firstElementChild
const songInfo = document.getElementsByClassName("song-info")[0]
let elements = document.querySelectorAll(".song-info")



function animeTitle(){
	elements.forEach(element => {
		const elementCharacter = element.firstElementChild.textContent.split("")
		
		console.log(element.firstElementChild)
		if (elementCharacter.length >= 12){
			element.firstElementChild.setAttribute("data-length", "true")
		} else{
			element.firstElementChild.setAttribute("data-length", "false")
		}
	});
}



let currentAudioIndex = 0;

function reinitialize() {
	progressBar.style.transition = "none";
	progressCircle.style.transition = "none";
	progressBar.style.width = "0";
	progressCircle.style.left = "-3%";
}

function loadNextAudio() {
	currentAudioIndex++;
	if (currentAudioIndex >= songs.length) {
		currentAudioIndex = 0;
	}
	audio.src = songs[currentAudioIndex].audioSrc;
	songTitle.textContent = songs[currentAudioIndex].title
	singerName.textContent = songs[currentAudioIndex].artist
	albumImg.src = songs[currentAudioIndex].cover
	body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${songs[currentAudioIndex].cover})`
	body.style.backgroundSize = "cover"
	body.style.backgroundPosition = "top 25% left 90%"

	/*permet de faire defiler le titre de la chanson
	 courante si les characteres sont superieur a 12*/
	 animeTitle()
	 updateDurationTime()
	 playPause()
	reinitialize();
}

function loadPrevAudio() {
	currentAudioIndex--;
	if (currentAudioIndex < 0) {
		currentAudioIndex = songs.length - 1;
	}
	audio.src = songs[currentAudioIndex].audioSrc;
	songTitle.textContent = songs[currentAudioIndex].title
	singerName.textContent = songs[currentAudioIndex].artist
	albumImg.src = songs[currentAudioIndex].cover
	body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${songs[currentAudioIndex].cover})`
	body.style.backgroundSize = "cover"
	body.style.backgroundPosition = "top 25% left 90%"
	animeTitle()
	playPause();
	reinitialize();
}

function playPause(){
	if (audio.paused) {
		audio.play();
		playPauseBtn.firstElementChild.classList.remove("fa-play");
		playPauseBtn.firstElementChild.classList.add("fa-pause");
	} else {
		audio.pause();
		playPauseBtn.firstElementChild.classList.remove("fa-pause");
		playPauseBtn.firstElementChild.classList.add("fa-play");
	}
}

function updateDurationTime() {
	const progress = Math.round((audio.currentTime / audio.duration) * 100);
	const currentTime = audio.currentTime;
	
	const currentTimeMinutes = Math.floor(currentTime / 60)
	.toString()
		.padStart(2, "0");
		const currentTimeSecondes = Math.floor(currentTime % 60)
		.toString()
		.padStart(2, "0");
		time[0].textContent = `${currentTimeMinutes}:${currentTimeSecondes}`;

		audio.addEventListener("loadedmetadata", ()=>{
			const duration = songs[currentAudioIndex].duration
			time[1].textContent = `${duration}`;
	})

	progressBar.style.width = `${progress}%`;
	progressCircle.style.left = `${progress - 3}%`;
}

window.addEventListener("DOMContentLoaded", animeTitle)

playPauseBtn.addEventListener("click", playPause);

// shuffleBtn.addEventListener("click", () => {
// 	//fonction qui permet de choisir une musique random
// });

prevBtn.addEventListener("click", loadPrevAudio);

nextBtn.addEventListener("click", loadNextAudio);

// repeatBtn.addEventListener("click", () => {
// 	//fonction qui permet de repeter la lecture d'un song
// });

volumeUpBtn.addEventListener("click", () => {
	audio.volume = Math.min(1, audio.volume + 0.1)
	volumeLevel.style.width = `${audio.volume * 100}%`
	volumeCircle.style.left = `${(audio.volume * 100) - 5}%`

	if(volumeDown.firstElementChild.classList.contains("fa-volume-xmark")){
		volumeDown.firstElementChild.classList.remove("fa-volume-xmark");
		volumeDown.firstElementChild.classList.add("fa-volume-down");
	}
});

volumeDown.addEventListener("click", () => {
	audio.volume = Math.max(0, audio.volume - 0.1)
	volumeLevel.style.width = `${audio.volume * 100}%`
	volumeCircle.style.left = `${(audio.volume * 100) - 5}%`

	if(audio.volume === 0){
		volumeDown.firstElementChild.classList.remove("fa-volume-down");
		volumeDown.firstElementChild.classList.add("fa-volume-xmark");
	}
});

audio.addEventListener("timeupdate", updateDurationTime);
audio.addEventListener("durationchange", updateDurationTime);
audio.addEventListener("ended", loadNextAudio);

progressCircle.addEventListener("mousedown", (e)=>{
	e.preventDefault()
	const progressDivRect = progressDiv.getBoundingClientRect()
	const progressDivWidth = progressDivRect.width

	function handleMouseMove(e){
		progressBar.style.transition = "none";
		progressCircle.style.transition = "none";
		const x = e.clientX - progressDivRect.left
		const progress = Math.min(1, Math.max(0, x / progressDivWidth))
		progressBar.style.width = `${progress * 100}%`
		audio.currentTime = progress * audio.duration
	}


	function handleMouseup(){
		document.removeEventListener("mousemove", handleMouseMove)
		document.removeEventListener("mouseup", handleMouseup)
	}

	document.addEventListener("mousemove", handleMouseMove)
	document.addEventListener("mouseup", handleMouseup)
	
})

volumeBar.addEventListener("click",(event)=>{
	const volumeBarWidth = volumeBar.offsetWidth
	const clickedPosition = event.clientX - volumeBar.getBoundingClientRect().left
	const volumePercent = clickedPosition /  volumeBarWidth

	audio.volume = volumePercent
	volumeLevel.style.width = `${volumePercent * 100}%`
	volumeCircle.style.left = `${clickedPosition}%`
})

progressDiv.addEventListener("click", (e)=>{
	const progressBarWidth = progressDiv.offsetWidth
	let clickedPosition = e.clientX - progressDiv.getBoundingClientRect().left
	const progress = clickedPosition / progressBarWidth

	progressBar.style.transition = "none";
	progressCircle.style.transition = "none";
	progressBar.style.width = `${progress * 100}%`
	audio.currentTime = progress * audio.duration
})

volumeCircle.addEventListener("mousedown", (event)=>{
	event.preventDefault()
	const startX = event.clientX
	const circleLeft = volumeCircle.offsetLeft
	const barWidth = volumeBar.offsetWidth

	function onMouseMove(event){
		const positionX = event.clientX - startX
		const circlePosition = circleLeft + positionX
		let positionPercentage = (circlePosition + (volumeCircle.offsetWidth / 2)) / barWidth

		if(positionPercentage < 0){
			positionPercentage = 0
		} else if(positionPercentage > 1){
			positionPercentage = 1
		}

		audio.volume = positionPercentage
		volumeLevel.style.width = `${positionPercentage  * 100}%`
		volumeCircle.style.left = `${circlePosition - (volumeCircle.offsetWidth / 2)}%`

		//Evitez le debordement de volumeCircle
		if (circlePosition < 0){
			volumeCircle.style.left = `-5%`
		} else if(circlePosition > barWidth - volumeCircle.offsetWidth){
			volumeCircle.style.left = `${barWidth - volumeCircle.offsetWidth +7}%`
		}
	}

	function onMouseUp(){
		document.removeEventListener("mousemove", onMouseMove)
		document.removeEventListener("mouseup", onMouseUp)
	}

	document.addEventListener("mousemove", onMouseMove)
	document.addEventListener("mouseup", onMouseUp)
})

window.addEventListener("load", ()=>{
	
	audio.volume = 0.5
	volumeLevel.style.width = `${audio.volume * 100}%`
	volumeCircle.style.left = `${audio.volume * 100 - 5}%`

	songTitle.textContent = songs[0].title
	singerName.textContent = songs[0].artist
	albumImg.src = songs[0].cover
	audio.src = songs[0].audioSrc

	body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${songs[currentAudioIndex].cover})`
	body.style.backgroundSize = "cover"
	body.style.backgroundPosition = "top 25% left 90%"
})

audio.addEventListener("loadedmetadata", ()=>{
	const currentTime = audio.currentTime;
	const duration = songs[0].duration

	const currentTimeMinutes = Math.floor(currentTime / 60)
		.toString()
		.padStart(2, "0");
	const currentTimeSecondes = Math.floor(currentTime % 60)
		.toString()
		.padStart(2, "0");
	time[0].textContent = `${currentTimeMinutes}:${currentTimeSecondes}`;
	time[1].textContent = `${duration}`;
})



