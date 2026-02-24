
// this is a basic log to display the console because I cant accesss it at work
function log_debug(message) {
	const logg = document.getElementById('debug-log');
	if(logg) {
		const timestamp = new Date().toLocaleTimeString();
		logg.innerHTML += `<p>[${timestamp}] ${message}</p>`;
		logg.scrollTop = logg.scrollHeight;
	}
}

// to get it to go all I need to do is paste the below code at the bottom of the body
// <div id="debug-log" style="background: #000; color: #00ff00; font-family: monospace; padding: 20px; margin-top: 50px; border-top: 2px solid red; height: 200px; overflow-y: 
// scroll;">
//    <p>-- Debug Console Initialized --</p>
// </div>