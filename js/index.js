import { baseUrl } from "./settings/api.js";
import { toogleLoginLogout, createAdminMenu } from "./utils/createAdminMenu.js";
const container = document.querySelector(".featured-products");

createAdminMenu();
toogleLoginLogout();

const productUrl = baseUrl + "/products/";

(async function () {
	try {
		const response = await fetch(productUrl);
		const products = await response.json();
		console.log(products);

		const isProductFeatured = products[2].featured;
		console.log(isProductFeatured);

		for (let i = 0; i < products.length; i++) {
			console.log(products[i].featured);
			if (products[i].featured) {
				container.innerHTML += `
										<a class="product-card" href="detail.html?id=${products[i].id}">
                                            <img class="product-image"src="${baseUrl}${products[i].image_url}"
												<h2>${products[i].title}</h2>
												<p>${products[i].price}</p>
                                        </a>`;
			}
		}
	} catch (error) {
		console.log(error);
	}
})();
