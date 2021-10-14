import { createAdminMenu, toogleLoginLogout } from "./utils/createAdminMenu.js";
import displayMessage from "./utils/displayMessage.js";
import { getToken } from "./utils/storage.js";
import { baseUrl } from "./settings/api.js";

const token = getToken();

if (!token) {
	location.href = "/";
}

createAdminMenu();
toogleLoginLogout();

const form = document.querySelector(".add-product-form");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const message = document.querySelector(".add-message-container");
const checkbox = document.querySelector("#checkbox");
const loader = document.querySelector(".loader");
const formElement = document.querySelector("form");

// formElement.addEventListener("submit", (e) => {
//  	e.preventDefault();

//  	const request = new XMLHttpRequest();

//  	request.open("POST", "http://localhost:1337/upload");

//  	request.send(new FormData(formElement));
//  });

//  image.addEventListener("change", (event) => {
//  	const fileList = event.target.files;
//  	console.log(fileList);
//  });

form.addEventListener("submit", submitForm);
function submitForm(event) {
	event.preventDefault();
	message.innerHTML = "";

	const titleValue = title.value.trim();
	const priceValue = parseFloat(price.value);
	const descriptionValue = description.value.trim();

	if (
		titleValue.length === 0 ||
		priceValue.length === 0 ||
		isNaN(priceValue) ||
		descriptionValue.length === 0
	) {
		displayMessage(
			"warning",
			"Please suply proper values",
			".add-message-container"
		);
		return false;
	} else {
		// Uploading image
		let returnImageUrl = "";
		const request = new XMLHttpRequest();
		request.open("POST", "http://localhost:1337/upload");
		request.send(new FormData(formElement));
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				const requestArrayString = request.response;
				const requestArray = JSON.parse(requestArrayString);
				console.log(requestArray);
				returnImageUrl = requestArray[0].url;
				console.log(returnImageUrl);
			}

			// addProduct(titleValue, priceValue, descriptionValue, returnImageUrl);
		};
		setTimeout(function () {
			addProduct(titleValue, priceValue, descriptionValue, returnImageUrl);
		}, 1000);
	}
}

async function addProduct(title, price, description, image) {
	loader.style.display = "block";
	const url = baseUrl + "/products";
	let checkboxValue = false;
	if (checkbox.checked) {
		checkboxValue = true;
	}
	console.log("checkboxvalue: ", checkboxValue);
	const data = JSON.stringify({
		title: title,
		price: price,
		description: description,
		image_url: image,
		featured: checkboxValue,
	});

	const options = {
		method: "POST",
		body: data,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	try {
		const response = await fetch(url, options);
		const json = await response.json();
		console.log(json);
		loader.style.display = "none";

		if (json.created_at) {
			displayMessage("success", "Product Created", ".add-message-container");
			form.reset();
		}

		if (json.error) {
			displayMessage("error", json.message, ".add-message-container");
		}

		console.log(json);
	} catch (error) {
		console.log(error);
		displayMessage("error", "An error occured", ".add-message-container");
	}
}
