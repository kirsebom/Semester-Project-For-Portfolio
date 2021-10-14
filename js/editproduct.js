import { baseUrl } from "./settings/api.js";
import { createAdminMenu, toogleLoginLogout } from "./utils/createAdminMenu.js";
import { getToken } from "./utils/storage.js";

const token = getToken();

if (!token) {
	location.href = "/";
}

createAdminMenu();
toogleLoginLogout();

const productsUrl = baseUrl + "/products";

(async function () {
	const container = document.querySelector(".product-container");
	const search = document.querySelector(".search");

	try {
		const response = await fetch(productsUrl);
		const productsArray = await response.json();
		console.log(productsArray);
		let productsToRender = productsArray;

		container.innerHTML = "";

		function renderProducts() {
			container.innerHTML = "";
			productsToRender.forEach(function (product) {
				container.innerHTML += `<a class="product-card" href="edit.html?id=${product.id}">
											<img class="product-image"src="${baseUrl}${product.image_url}">
											<h4>${product.title}</h4>
											<p>Price: ${product.price},-</p>
										</a>
											`;
			});
		}
		renderProducts();

		search.onkeyup = function () {
			console.log(event);

			const searchValue = event.target.value.trim().toLowerCase();
			const filteredProducts = productsArray.filter(function (product) {
				if (
					product.title.toLowerCase().includes(searchValue) ||
					product.description.toLowerCase().includes(searchValue)
				) {
					return true;
				}
			});

			console.log(filteredProducts);

			productsToRender = filteredProducts;

			renderProducts();
		};
	} catch (error) {
		console.log(error);
	}
})();
