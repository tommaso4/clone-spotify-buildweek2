const artistsUrl = "https://api.spotify.com/v1/artists/";
const albumsUrl = "https://api.spotify.com/v1/albums/";
const params = new URLSearchParams(window.location.search);
const idArtist = params.get("id");


async function fetchArtists() {
    const artist = await new DataObject(artistsUrl + idArtist, apiKey).fetchData();
    console.log(artist);

    const mainDiv1 = document.getElementById("main-div-1");
    const h1 = document.querySelector("h1");
    const ascoltatori = document.querySelectorAll(".ascoltatori");
    const numeroAscoltatori = Math.floor(Math.random() * 5000000) + 5000000;
    const mainPlayBtns = document.querySelectorAll(".play-circle");
    
    mainDiv1.style.backgroundImage = `url(${artist.images[0].url})`;
    h1.innerText = artist.name;
    for (let el of ascoltatori) el.innerText = `${setPoints(numeroAscoltatori)} ascoltatori mensili`;

    const songs = await new DataObject(`https://api.spotify.com/v1/artists/${idArtist}/top-tracks?market=it`, apiKey).fetchData();
    console.log(songs);

    const fotoDi = document.querySelector(".foto-di");
    const di = document.querySelectorAll(".di");
    const arr = [];
    const clonesArr = [];
    let durationSum = 0;

    for (let i = 0; i < songs.tracks.length; i++) {
        const target = document.getElementById("canzoni");
        const template = document.getElementById("song-template");
        const clone = document.importNode(template.content, true).firstElementChild;
        const numberP = clone.querySelector(".song-number");
        const img = clone.querySelector("img");
        const titleP = clone.querySelector(".song-title");
        const playedP = clone.querySelectorAll(".song-played");
        const durationP = clone.querySelector(".song-duration");

        const id = songs.tracks[i].id;
        const number = i + 1;
        const title = songs.tracks[i].name;
        const played = Math.floor(Math.random() * 9800000) + 20000;
        const duration = songs.tracks[i]["duration_ms"];
        const previousId = i > 0 ? songs.tracks[i - 1].id : songs.tracks[songs.tracks.length - 1].id;
        const nextId = i < (songs.tracks.length - 1) ? songs.tracks[i + 1].id : songs.tracks[0].id;
        durationSum += duration;

        numberP.innerText = number;
        img.src = songs.tracks[i].album.images[0].url;
        titleP.innerText = title;
        playedP.forEach(el => el.innerText = setPoints(played));
        durationP.innerText = secondsToMinutes(Math.floor(duration / 1000));

        target.append(clone);

        clone.addEventListener("click", () => {
            new Footer(id, title, artist.name, img.src, Math.floor(duration / 1000), nextId, previousId, songs.tracks[i]["preview_url"]);
            songInfo.style.visibility = "hidden";
        });

        clone.addEventListener("mouseenter", () => {
            numberP.innerHTML = '<i class="fa-solid fa-play"></i>';
        });

        clone.addEventListener("mouseleave", () => {
            numberP.innerHTML = number;
        })

        clonesArr.push(clone);
    }
    console.log(fotoDi)
    fotoDi.src = artist.images[0].url;
    di[0].innerText = "8 brani di " + artist.name;
    di[1].innerText = "Di " + artist.name;

    durationSum /= 1000;
    const minutes = Math.floor(durationSum / 60);
    const seconds = Math.floor(durationSum - (minutes * 60));
    const eventoClick = new Event("click");

    for (let mainPlayBtn of mainPlayBtns) {
        mainPlayBtn.addEventListener("click", () => {
            clonesArr[0].dispatchEvent(eventoClick);
        });
    }
}

fetchArtists();