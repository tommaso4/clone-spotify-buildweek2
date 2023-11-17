async function getSpotifyAccessToken() {
    const clientId = 'ea7fa703a83b4b28ba94bd8e01532b01';
    const clientSecret = '0fbd691c01ac48b684d5508c9cca8db8';

    const requestBody = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
        });

        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            throw new Error('Failed to fetch Spotify access token');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function scriviCookie(nomecookie, testo) {
    let now = new Date();//Date crea un oggetto data contenente data ed ora attuali
    
    now.setHours(now.getHours() + 1);//Alla data attuale aggiungo un ora

    let scadenza = "expires=" + now.toUTCString();//converto la data nel formato utc, richiesto per il corretto funzionamento del cookie. esempio: Wed, 14 Jun 2017 07:00:00 GMT

    document.cookie = `${ nomecookie }=${ scadenza }`;
}

// Usage example
getSpotifyAccessToken()
    .then((accessToken) => {
        localStorage.setItem("token", accessToken);
        console.log('Access Token:', accessToken);
        scriviCookie('spotify', accessToken)
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });


