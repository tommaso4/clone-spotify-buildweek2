const albumsUrl = "https://api.spotify.com/v1/albums/";
const tracksUrl = "https://api.spotify.com/v1/tracks/";
const params = new URLSearchParams(window.location.search);
const idAlbum = params.get("id");


async function fetchAlbums() {
    const album = await new DataObject(albumsUrl + idAlbum, apiKey).fetchData();
    const songs = album.tracks.items;
    const mainPlayBtn = document.getElementById("main-play-btn");
    let eventoClick = new Event("click");

    const arr = [];
    const clonesArr = [];
    const statusArray = [];
    let temp;
    let durationSum = 0;

    for (let i = 0; i < songs.length; i++) {
        const target = document.getElementById("second-main-div");
        const template = document.getElementById("song-template");
        const clone = document.importNode(template.content, true).firstElementChild;
        const numberP = clone.querySelector(".song-number");
        const titleP = clone.querySelector(".song-title");
        const artistP = clone.querySelector(".song-artist");
        const playedP = clone.querySelector(".song-played");
        const durationP = clone.querySelector(".song-duration");

        const arr = [];
        for (art of songs[i].artists) arr.push(art.name);

        const id = songs[i].id;
        const number = i + 1;
        const title = songs[i].name;
        const artist = arr.join(", ");
        const played = Math.floor(Math.random() * 9800000) + 20000;
        const duration = songs[i]["duration_ms"];
        const previousId = i > 0 ? songs[i - 1].id : songs[songs.length - 1].id;
        const nextId = i < (songs.length - 1) ? songs[i + 1].id : songs[0].id;
        durationSum += duration;

        numberP.innerText = number;
        titleP.innerText = title;
        artistP.innerText = artist;
        playedP.innerText = setPoints(played);
        durationP.innerText = secondsToMinutes(Math.floor(duration / 1000));

        target.append(clone);

        clone.addEventListener("click", () => {
            new Footer(id, title, artist, album.images[0].url, Math.floor(duration / 1000), nextId, previousId, songs[i]["preview_url"]);
            songInfo.style.visibility = "visible"
        });

        clonesArr.push(clone);
    }
    
    durationSum /= 1000;
    const albumImgs = document.querySelectorAll("#main-div-1-1 img, #main-div-1-2 img");
    const albumTitle = document.getElementById("album-name");
    const albumArtist = document.getElementById("album-artist");
    const minutes = Math.floor(durationSum / 60);
    const seconds = Math.floor(durationSum - (minutes * 60));

    for (let albumImg of albumImgs) albumImg.src = album.images[0].url;
    albumTitle.innerText = album.name;
    albumArtist.innerHTML = `${album.artists[0].name}
    <span class="d-none d-md-inline"><i class="fa-solid fa-circle"></i></span>
    <span class="d-none d-md-inline" id="album-year">${new Date(album["release_date"]).getFullYear()}</span>
    <span class="d-none d-md-inline"><i class="fa-solid fa-circle"></i></span>
    <span class="d-none d-md-inline" id="album-length">${songs.length} brani,</span>
    <span class="d-none d-md-inline">${minutes} min ${seconds} sec</span>`;

    mainPlayBtn.addEventListener("click", () => {
        clonesArr[0].dispatchEvent(eventoClick);
    });
}

fetchAlbums()