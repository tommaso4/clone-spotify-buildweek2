class Footer {
    constructor(id, title, artist, img, duration, next, previous, preview) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.img = img;
        this.duration = duration;
        this.next = next;
        this.previous = previous;
        this.preview = preview;
        this.HTMLInit();
        this.buttonsHandle();
    }

    HTMLInit() {
        const song = document.getElementById("song");
        const playBtn = document.getElementById("play");
        const audio = document.querySelector("audio");
        if (song) song.remove();
        playBtn.remove();
        if (audio) audio.remove();

        const template = document.getElementById("footer-template");
        const clone = document.importNode(template.content, true).firstElementChild;
        const img = document.querySelector("#song-info img");
        const id = document.querySelector("#song-info i");
        const footerSongTitle = document.getElementById("footer-song-title");
        const footerSongArtist = document.getElementById("footer-song-artist");
        const player = document.getElementById("player");
        const playBtnTemplate = document.getElementById("play-btn-template");
        const playBtnClone = document.importNode(playBtnTemplate.content, true).firstElementChild;
        playBtnClone.setAttribute("preview", this.preview);

        img.src = this.img;
        footerSongTitle.innerText = this.title;
        footerSongArtist.innerText = this.artist;
        clone.setAttribute("song-duration", this.duration);
        player.setAttribute("previous-song", this.previous);
        player.setAttribute("next-song", this.next);
        id.setAttribute("song-id", this.id);
        if (Array.isArray(JSON.parse(localStorage.getItem("song-id")))) {
            if (JSON.parse(localStorage.getItem("song-id")).includes(id.getAttribute("song-id"))) {
                id.classList.remove("fa-regular");
                id.classList.add("fa-solid");
            } else {
                id.classList.add("fa-regular");
                id.classList.remove("fa-solid");
            }
        }

        player.append(clone);
        document.getElementById("play-btn-target").append(playBtnClone);

        let songDurationP = document.getElementById("song-duration");
        songDurationP.innerText = secondsToMinutes(this.duration);
    }

    buttonsHandle() {
        let songTime = document.getElementById("song-time");
        let isMousePressed = false, clickPosition, startX, lastX, currentX;
        let songTimeLine = document.getElementById("song-time-line");
        let songTimeToggler = document.getElementById("song-time-toggler");
        let songStatus = 0;
        let songStatusP = document.getElementById("song-status");
        let songAdvancement;
        let px;
        let play = document.getElementById("play");
        let playBtn = document.getElementById("play-btn");
        let audio = null;
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("play");

        songTime.addEventListener("click", (e) => {
            clickPosition = e.clientX - songTime.getBoundingClientRect().left;
            songTimeLine.style.width = clickPosition + "px";

            songStatusP.innerText = secondsToMinutes(songStatus);
        });

        songTime.addEventListener("mouseenter", () => {
            if (!isMousePressed) songTimeToggler.classList.remove("d-none");
        });

        songTime.addEventListener("mouseleave", () => {
            if (!isMousePressed) songTimeToggler.classList.add("d-none");
        });

        songTime.addEventListener("mousedown", (e) => {
            isMousePressed = true;
            e.preventDefault();
            clickPosition = e.clientX - songTime.getBoundingClientRect().left;
            songTimeLine.style.width = clickPosition + "px";
            startX = e.clientX;
            lastX = startX;
            songTimeToggler.classList.remove("d-none");
            document.body.classList.add("pointer");
        });

        document.addEventListener("mousemove", (e) => {
            if (isMousePressed) {
                currentX = e.clientX;
                let deltaX = currentX - lastX;
                lastX = currentX;
                let width = parseInt(songTimeLine.style.width);
                width += deltaX;
                if (width >= 400) width = 400;
                if (width < 0) width = 0;

                songTimeLine.style.width = width + "px";
                songStatus = (width * songDuration) / 400;
                songStatusP.innerText = secondsToMinutes(songStatus);
                console.log(width)
                console.log(songStatus)
            }
        });

        document.addEventListener("mouseup", () => {
            isMousePressed = false;
            songTimeToggler.classList.add("d-none");
            document.body.classList.remove("pointer");
        });

        play.addEventListener("click", () => {
            if (playBtn.classList.contains("fa-play")) {
                playBtn.classList.remove("fa-play");
                playBtn.classList.add("fa-pause");
                playBtn.classList.remove("play");

                if (audio) {
                    audio.play();
                } else {
                    audio = new Audio(this.preview);
                    document.body.append(audio);
                    audio.style.display = "none";
                    audio.play();
                }

                songAdvancement = setInterval(() => {
                    songStatus += 1;
                    songStatusP.innerText = secondsToMinutes(songStatus);

                    px = (400 * songStatus) / this.duration;
                    songTimeLine.style.width = px + "px";
                }, 1000);
            } else {
                playBtn.classList.add("fa-play");
                playBtn.classList.remove("fa-pause");
                playBtn.classList.add("play");

                audio.pause();

                clearInterval(songAdvancement);
            }
        });

        let eventoClick = new Event("click");
        play.dispatchEvent(eventoClick);
    }
}

// FUNZIONE DI GESTIONE DELLA FUNZIONALITA DEI LIKE

function likesHandler() {
    let like = document.querySelector("footer .like-heart");

    like.addEventListener("click", () => {
        like.classList.toggle("fa-regular");
        like.classList.toggle("fa-solid");
        let array = JSON.parse(localStorage.getItem("song-id"));
        
        if (Array.isArray(array)) {
            console.log(Array.isArray(array));
            console.log(array.indexOf(like.getAttribute("song-id")));
            if (array.indexOf(like.getAttribute("song-id")) == -1) {
                array.push(like.getAttribute("song-id"));
                localStorage.setItem("song-id", JSON.stringify(array));
            } else {
                array.splice(array.indexOf(like.getAttribute("song-id")), 1);
                localStorage.setItem("song-id", JSON.stringify(array));
            }
        } else {
            array = [];
            array.push(like.getAttribute("song-id"));
            localStorage.setItem("song-id", JSON.stringify(array));
        }
    })
}

likesHandler();

// FUNZIONE DI GESTIONE ICONE
const underlineIcons = document.querySelectorAll(".underline-icon");
underlineIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        icon.classList.toggle("underline");
        icon.nextElementSibling.classList.toggle("underline");
    });
});










const volumeOuter = document.getElementById("volume-outer");
const volume = document.getElementById("volume");
const volumeToggler = document.getElementById("volume-toggler");
const volumeIcon = document.getElementById("volume-icon");
let clickPositionVolume;
let audio;
let volumePercentage = 1, volumeStatus, volumeClicked = false;
let isMousePressedVolume, startVolumeX, lastVolumeX, currentVolumeX;

volumeOuter.addEventListener("mouseenter", () => {
    if (!isMousePressedVolume) volumeToggler.classList.remove("d-none");
});

volumeOuter.addEventListener("mouseleave", () => {
    if (!isMousePressedVolume) volumeToggler.classList.add("d-none");
});

volumeOuter.addEventListener("click", (e) => {
    const audio = document.querySelector("audio");
    volumeClicked = false;
    clickPositionVolume = e.clientX - volumeOuter.getBoundingClientRect().left;
    if (clickPositionVolume > 100) clickPositionVolume = 100;
    if (clickPositionVolume < 0) clickPositionVolume = 0;
    volume.style.width = clickPositionVolume + "px";
    audio.volume = clickPositionVolume / 100;

    volumePercentage = (clickPositionVolume / 100).toFixed(2);

    if (volumePercentage >= 0.5) {
        volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-low");
        volumeIcon.classList.add("fa-volume-high");
    } else if (volumePercentage > 0 && volumePercentage < 0.5) {
        volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-high");
        volumeIcon.classList.add("fa-volume-low");
    } else if (volumePercentage == 0) {
        volumeIcon.classList.remove("fa-volume-low", "fa-volume-high");
        volumeIcon.classList.add("fa-volume-xmark");
    }
});

volumeOuter.addEventListener("mousedown", (e) => {
    const audio = document.querySelector("audio");
    isMousePressedVolume = true;
    volumeClicked = true;
    e.preventDefault();
    clickPositionVolume = e.clientX - volumeOuter.getBoundingClientRect().left;
    volume.style.width = clickPositionVolume + "px";
    startVolumeX = e.clientX;
    lastVolumeX = startVolumeX;
    volumeToggler.classList.remove("d-none");
    document.body.classList.add("pointer");

    audio.volume = clickPositionVolume / 100;
});

document.addEventListener("mousemove", (e) => {
    const audio = document.querySelector("audio");
    if (isMousePressedVolume) {
        currentVolumeX = e.clientX;
        let deltaVolumeX = currentVolumeX - lastVolumeX;
        lastVolumeX = currentVolumeX;
        let width = parseInt(volume.style.width);
        width += deltaVolumeX;
        if (width >= 100) width = 100;
        if (width < 0) width = 0;
        volume.style.width = width + "px";

        volumePercentage = (width / 100).toFixed(2);

        if (volumePercentage >= 0.5) {
            volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-low");
            volumeIcon.classList.add("fa-volume-high");
        } else if (volumePercentage > 0 && volumePercentage < 0.5) {
            volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-high");
            volumeIcon.classList.add("fa-volume-low");
        } else if (volumePercentage == 0) {
            volumeIcon.classList.remove("fa-volume-low", "fa-volume-high");
            volumeIcon.classList.add("fa-volume-xmark");
        }

        audio.volume = width / 100;
    }
});

document.addEventListener("mouseup", () => {
    const audio = document.querySelector("audio");
    isMousePressedVolume = false;
    volumeToggler.classList.add("d-none");
    document.body.classList.remove("pointer");

    audio.volume = parseInt(volume.style.width) / 100;
});

volumeIcon.addEventListener("click", () => {
    if (!volumeClicked) volumeStatus = parseInt(volume.style.width) / 100;
    volumeClicked = volumeClicked ? false : true;

    if (volumeClicked) {
        volume.style.width = 0;
        volumeIcon.classList.remove("fa-volume-low", "fa-volume-high");
        volumeIcon.classList.add("fa-volume-xmark");
    } else {
        if (volumeStatus >= 0.5) {
            volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-low");
            volumeIcon.classList.add("fa-volume-high");
        } else if (volumeStatus > 0 && volumeStatus < 0.5) {
            volumeIcon.classList.remove("fa-volume-xmark", "fa-volume-high");
            volumeIcon.classList.add("fa-volume-low");
        }

        volume.style.width = (volumeStatus * 100) + "px";
    }
});