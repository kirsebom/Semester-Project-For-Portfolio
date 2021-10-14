import { baseUrl } from "./settings/api.js";
import { createAdminMenu, toogleLoginLogout } from "./utils/createAdminMenu.js";

createAdminMenu();
toogleLoginLogout();

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

const productUrl = baseUrl + "/products/" + id;

console.log(productUrl);

(async function () {
	try {
		const response = await fetch(productUrl);
		const json = await response.json();
		document.title = json.title;
		console.log(json);
		const container = document.querySelector(".detail-container");

		container.innerHTML = ` <img class="detail-image"src="${baseUrl}${json.image_url}">
                                <div class="product-info">
                                    <h1>${json.title}</h1>
                                    <p class="detail-price">${json.price},-</p>
                                    <p class="detail-description">${json.description}</p>
                                    <button class="addtocart-btn" data-timestamp="" data-id="${json.id}" data-title="${json.title}" data-price="${json.price}" data-img="${baseUrl}${json.image_url}">
									add to cart</button>
                                </div>
                                `;
		// Add to cart button
		const cartButton = document.querySelector(".addtocart-btn");

		cartButton.addEventListener("click", addToCart);

		function addToCart() {
			const popupMessage = document.querySelector(".popup-message");
			popupMessage.innerHTML = `<div class="popup-message-header">
											<h2>Product added to cart</h2>
											<i class="fas fa-times"></i>
										</div>
										<div class="popup-message-content">
											<img class="popup-image"src="${baseUrl}${json.image_url}">
											<div class ="popup-message-info">
												<h3>${json.title}</h3>
												<p>${json.price},-</p>
											</div>
										</div>
										<div class="popup-buttons">
											<button class="popup-button continue-shopping-button">Continue Shopping</button>
											<button class="popup-button gotocart-button">Go to cart</button>
										</div>
											
										
										`;

			const popupContainer = document.querySelector(".popup-message-container");
			popupContainer.style.display = "block";
			popupMessage.style.display = "block";

			const closeButton = document.querySelector(".popup-message i");
			closeButton.addEventListener("click", closePopup);
			function closePopup() {
				popupContainer.style.display = "none";
				popupMessage.style.display = "none";
			}
			const continueShoppingButton = document.querySelector(
				".continue-shopping-button"
			);
			continueShoppingButton.addEventListener("click", continueShopping);
			function continueShopping() {
				popupContainer.style.display = "none";
				popupMessage.style.display = "none";
				location.href = "/shop.html";
			}

			const moveToCartButton = document.querySelector(".gotocart-button");
			moveToCartButton.addEventListener("click", redirectToCart);
			function redirectToCart() {
				popupContainer.style.display = "none";
				popupMessage.style.display = "none";
				location.href = "/cart.html";
			}

			const id = this.dataset.id;
			const title = this.dataset.title;
			const price = this.dataset.price;
			const img = this.dataset.img;

			const timestamp = event.timeStamp;
			console.log(timestamp);
			this.dataset.timestamp = timestamp;
			const timestampString = JSON.stringify(timestamp);
			console.log(timestampString);

			const currentCart = getExisitingCart();

			const product = {
				id: id,
				title: title,
				price: price,
				img: img,
				timestamp: timestampString,
			};

			currentCart.push(product);

			saveCart(currentCart);
		}
		function getExisitingCart() {
			const cart = localStorage.getItem("cart");

			if (cart === null) {
				return [];
			} else {
				return JSON.parse(cart);
			}
		}
		function saveCart(cart) {
			localStorage.setItem("cart", JSON.stringify(cart));
		}
	} catch (error) {
		console.log(error);
	}
})();
