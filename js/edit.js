import { baseUrl } from "./settings/api.js";
import { createAdminMenu, toogleLoginLogout } from "./utils/createAdminMenu.js";
import displayMessage from "./utils/displayMessage.js";
import { getToken } from "./utils/storage.js";
import deleteButton from "./utils/deleteButton.js";

const token = getToken();

if (!token) {
	location.href = "/";
}

createAdminMenu();
toogleLoginLogout();

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

const productUrl = baseUrl + "/products/" + id;

console.log(productUrl);

const form = document.querySelector(".edit-product-form");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const idInput = document.querySelector("#id");
const message = document.querySelector(".edit-message-container");
const loader = document.querySelector(".loader");
const image = document.querySelector("#fileupload");
const checkbox = document.querySelector("#checkbox");

let oldImageUrl = "";

(async function () {
	try {
		const response = await fetch(productUrl);
		const details = await response.json();
		oldImageUrl = details.image_url;
		console.log(oldImageUrl);
		console.log(details);

		title.value = details.title;
		price.value = details.price;
		description.value = details.description;
		idInput.value = details.id;
		checkbox.checked = details.featured;

		deleteButton(details.id);
		console.log(details.image_url);
	} catch (error) {
		console.log(error);
	} finally {
		loader.style.display = "none";
		form.style.display = "block";
	}
})();

// setTimeout(function () {
// 	console.log(oldImageUrl);
// }, 100);

form.addEventListener("submit", submitForm);

function submitForm(event) {
	event.preventDefault();
	loader.style.display = "block";

	message.innerHTML = "";

	const titleValue = title.value.trim();
	const priceValue = parseFloat(price.value);
	const descriptionValue = description.value.trim();
	const idValue = idInput.value;

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
	}

	let returnImageUrl = oldImageUrl;
	const request = new XMLHttpRequest();
	request.open("POST", "http://localhost:1337/upload");
	request.send(new FormData(form));
	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			const requestArrayString = request.response;
			const requestArray = JSON.parse(requestArrayString);

			returnImageUrl = requestArray[0].url;

			console.log(returnImageUrl);
		}
	};

	setTimeout(function () {
		updateProduct(
			titleValue,
			priceValue,
			descriptionValue,
			idValue,
			returnImageUrl
		);
	}, 1000);
}

async function updateProduct(title, price, description, id, image) {
	let checkboxValue = false;
	if (checkbox.checked) {
		checkboxValue = true;
	}
	const url = baseUrl + "/products/" + id;
	const data = JSON.stringify({
		title: title,
		price: price,
		description: description,
		image_url: image,
		featured: checkboxValue,
	});

	const options = {
		method: "PUT",
		body: data,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	try {
		loader.style.display = "none";
		const response = await fetch(url, options);
		const json = await response.json();
		console.log(json);

		if (json.updated_at) {
			displayMessage("success", "Product updated", ".edit-message-container");
		}
		if (json.error) {
			displayMessage("error", json.message, ".edit-message-container");
		}
	} catch (error) {
		console.log(error);
	}
}
