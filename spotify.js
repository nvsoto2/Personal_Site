let max_length = 128;
let min_length = 43;

const client_id_ = 'e60dc0b268d94c358f419225629b4893';
const redirect_url = "https://nvsoto2.github.io/Personal_Site/personal.html";


// generates a random string of a random length between the spotify tolerance
// uses crypto to avoid math.random determinism
// 
function gen_random_string() {
	const possible_vals = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length_buffer = new Uint8Array(1);
	window.crypto.getRandomValues(length_buffer);
	const range = max_length - min_length + 1;
	length = Math.floor((length_buffer[0] / 256) * range) + min_length;
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible_vals[x % possible_vals.length], "");
}

// hash for the authorization request
//makes string into bytes
// hashes that data into the hash
async function sha256(string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(string);
	return await window.crypto.subtle.digest("SHA-256", data);
}

// makes it into base64 url
// takes hash, turns it into bytes, then turns that into ascii
function base64encode(input) {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, '') // remove padding
		.replace(/\+/g,'-') // replace + with -
		.replace(/\//g, '_'); // replace / with _
}


// saves code_verifier into memory
// puts the user on spotify's servers
async function authorize() {
	const scope = 'user-read-private user-read-email';
	const auth_url = new URL("https://accounts.spotify.com/authorize");
	
	const code_verifier = gen_random_string();
	const hashed = await sha256(code_verifier);
	const code_challenge_ = base64encode(hashed);
	
	window.localStorage.setItem('code_verifier', code_verifier);
	
	const params = {
		response_type: 'code',
		client_id: client_id_,
		scope,
		code_challenge_method: 'S256',
		code_challenge: code_challenge_,
		redirect_uri: redirect_url,
	}
	
	auth_url.search = new URLSearchParams(params).toString();
	window.location.href = auth_url.toString();
}

// send our ticket from spotify and the verifier and spotify will tell us if it matches
// 
async function get_token() {
	const code_verifier_ = localStorage.getItem('code_verifier');
	
	const url = "https://accounts.spotify.com/api/token";
	const payload = {
		method: "POST",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: client_id_,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: redirct_url,
			code_verifier: code_verifier_,
		}),
	}
	
	const body = await fetch(url, payload);
	const respone = await body.json();

	if (response.access_token) {
		localStorage.setItem("access_token", response.access_token);
	}
}


const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
if(code){
	get_token(code);
	window.history.replaceState({}, document.title, window.location.pathname);
}

async function fetch_playlists() {
	const token = localStorage.getItem('access_token');

	if(!token) {
		console.error("No access token found. Please login.");
		authorize();
		return; // might need to run the above line again instead
	}
	url = "https://api.spotify.com/v1/users/Snick_Doto/playlists";
	
	const result = await fetch(url, {
		method: "GET",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	if (result.status === 401) {
		console.warn("token expired. Re-authorizing...");
		localStorage.removeItem('access_token');
		authorize();
		return;
	}
	const data = await result.json();
	display_playlists(data.items);
}

function display_playlists(playlists) {
	const container = document.getElementById('playlist-container');
	container.innerHTML = "";
	
	playlists.forEach(playlist => {
		const playlist_element = document.createElement("div");
		playlist_element.className = 'playlist-card';
		const image_url = playlist.images[0]?.url || 'default-cover.png';
		
		playlist_element.innerHTML = `
			<img src="${image_url}" alt="{playlist.name}" width="200">
			<h3>${playlist.name}</h3>
			<p>${playlist.tracks.total} Tracks</p>
			<a href="${playlist.external_urls.spotify}" target="_blank">Listen on Spotify</a>
		`;
		container.appendChild(playlist_element);
	});
	show_playlist_ui();
}

function show_playlist_ui() {	
	document.getElementById('login-section').style.display = 'none';
	document.getElementById('playlist-section').style.display = 'block';

}
