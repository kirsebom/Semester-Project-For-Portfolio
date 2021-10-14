import displayMessage from "./utils/displayMessage.js";
import { saveToken, saveUser } from "./utils/storage.js";
import { baseUrl } from "./settings/api.js";
import { toogleLoginLogout, createAdminMenu } from "./utils/createAdminMenu.js";
import { getUsername } from "./utils/storage.js";

createAdminMenu();

function createLogoutPage() {
	const loginContainer = document.querySelector(".login-container");
	const loggedInMessage = document.querySelector(".login-message-container");
	const username = getUsername();

	if (username) {
		loginContainer.innerHTML = `<div class="logout-button-container"><button class="logout-button">Logout</button></div>`;
		loggedInMessage.innerHTML = `<p>You are logged in as ${username}</p>`;
	}
}
createLogoutPage();
toogleLoginLogout();

const form = document.querySelector(".login-box");
const username = document.querySelector(".username");
const password = document.querySelector(".password");
const message = document.querySelector(".message-container");
const loader = document.querySelector(".loader");

form.addEventListener("submit", loginForm);

function loginForm(event) {
	event.preventDefault();

	message.innerHTML = "";

	const usernameValue = username.value.trim();
	const passwordValue = password.value.trim();

	if (usernameValue.length === 0 || passwordValue.length === 0) {
		return displayMessage("warning", "Invalid values", ".message-container");
	}

	doLogin(usernameValue, passwordValue);
}

async function doLogin(username, password) {
	loader.style.display = "block";
	const url = baseUrl + "/auth/local";

	const data = JSON.stringify({ identifier: username, password: password });

	const options = {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/json",
		},
	};

	try {
		const response = await fetch(url, options);
		const json = await response.json();
		console.log(json);
		loader.style.display = "none";

		if (json.user) {
			saveToken(json.jwt);
			saveUser(json.user);
			location.href = "/login.html";
		}

		if (json.error) {
			displayMessage("warning", "Invalid login details", ".message-container");
		}
	} catch (error) {
		console.log(error);
		loader.display.style = "none";
	}
}

/*logout button*/
