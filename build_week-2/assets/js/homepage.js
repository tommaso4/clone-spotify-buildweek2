const idTrak = '5UHHuxxYFnuE5KBbpl4Hzu'
const urlTrank = `https://api.spotify.com/v1/tracks/${idTrak}`;
console.log('hello');

async function fetchTrack() {
    const data = await new DataObject(urlTrank, apiKey).fetchData();
    const imgAlHome = document.querySelector('#img-home-al')
    imgAlHome.src = data.album.images[0].url;
    const nameAlbum = document.querySelector('#nameAlbum')
    nameAlbum.innerText = data.album.name;
    const artistName = document.querySelectorAll('.nameArt')
    artistName.forEach(artist => artist.innerText = data.album.artists[0].name);
}

const urlPlaylist = 'https://api.spotify.com/v1/playlists/37i9dQZF1DX1gRalH1mWrP'

async function fetchPlaylists() {
    const data = await new DataObject(urlPlaylist, apiKey).fetchData();
    console.log(data.tracks.items[0]);
    for (let i = 0; i <= 5; i++) {
        createFirstCard(data, i);
    }
    for (let i = 0; i < 20; i++) {
        
        createAlbumCard(data,i)
    }
}

function createAlbumCard(data,i) {
    const aCardDiv = document.createElement('a');
    aCardDiv.href = './albums.html?id=' + data.tracks.items[i].track.album.id
    aCardDiv.classList.add('a-card', 'rounded', 'p-2', 'bts');

    const imgElement = document.createElement('img');
    imgElement.src = data.tracks.items[i].track.album.images[0].url;
    imgElement.classList.add('a-card-img');

    const nameParagraph = document.createElement('p');
    nameParagraph.classList.add('a-card-name', 'noOverFlow');
    nameParagraph.textContent = data.tracks.items[i].track.album.name;

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.classList.add('a-card-description','noOverFlow');
    descriptionParagraph.textContent = data.tracks.items[i].track.album.artists[0].name;

    aCardDiv.appendChild(imgElement);
    aCardDiv.appendChild(nameParagraph);
    aCardDiv.appendChild(descriptionParagraph);

    const secondRow = document.querySelector('#secondRowHome');
    secondRow.appendChild(aCardDiv);
}


function createFirstCard(data, i) {
    const mainCard = document.createElement('a');
    mainCard.href = './albums.html?id=' + data.tracks.items[i].track.album.id
    mainCard.classList.add('card', 'main-card-consigliati', 'bts');

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('d-flex', 'justify-content-start', 'h-100');

    const consigliatiDiv = document.createElement('div');
    consigliatiDiv.classList.add('main-consigliati-div-card', 'ms-0', 'me-0');

    const imgElement = document.createElement('img');
    imgElement.src = data.tracks.items[i].track.album.images[0].url
    imgElement.classList.add('rounded-start', 'img-fluid');
    imgElement.alt = '...';

    const paragraphElement = document.createElement('p');
    paragraphElement.classList.add('card-text', 'p-0', 'fw-bold', 'font-card-consigliati', 'pt-4', 'ps-2');
    const linkElement = document.createElement('a');
    linkElement.href = '#';
    linkElement.classList.add('text-decoration-none', 'text-white','noOverFlow');
    linkElement.textContent = data.tracks.items[i].track.name;
    paragraphElement.appendChild(linkElement);

    consigliatiDiv.appendChild(imgElement);
    innerDiv.appendChild(consigliatiDiv);
    innerDiv.appendChild(paragraphElement);
    mainCard.appendChild(innerDiv);

    const firstRow = document.querySelector('#firstRowHome');
    firstRow.appendChild(mainCard);
}


fetchTrack()
fetchPlaylists()