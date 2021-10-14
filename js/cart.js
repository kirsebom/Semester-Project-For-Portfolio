import { getFromStorage } from "./utils/storage.js";
import { createAdminMenu, toogleLoginLogout } from "./utils/createAdminMenu.js";

createAdminMenu();
toogleLoginLogout();

const cartArray = getFromStorage("cart");

const productContainer = document.querySelector(".cart-container");

if (!cartArray || cartArray.length === 0) {
	productContainer.innerHTML = `Your cart is empty`;
}

cartArray.forEach((cart) => {
	productContainer.innerHTML += `

                                        <div class="cart-product">
                                        <img class="cart-img"src="${cart.img}">
                                        <div class="cart-info">
                                            <h4>${cart.title}</h4>
                                            <a class="product-details-link"href="detail.html?id=${cart.id}">Product details</a>
                                            <p>${cart.price} NOK</p>
                                        </div>
                                        <i class="far fa-trash-alt" data-timestamp="${cart.timestamp}" data-id="${cart.id}" data-title="${cart.title}"></i>
                                        </div>
                                    `;
});
console.log(cartArray);

// Trash can button, remove product from cart button
const deleteButton = document.querySelectorAll(".cart-product i");
deleteButton.forEach((button) => {
	button.addEventListener("click", handleClick);
});

function handleClick() {
	console.log(event);
	const timestamp = this.dataset.timestamp;
	console.log(typeof timestamp);

	const newCartArray = cartArray.filter((cart) => cart.timestamp !== timestamp);
	console.log(cartArray);
	console.log(newCartArray);
	function saveToStorage(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}
	saveToStorage("cart", newCartArray);
	location.href = "/cart.html";
}

console.log(cartArray);

console.log(cartArray.length);
const sumContainer = document.querySelector(".total-sum-container");
if (cartArray.length > 0) {
	let sum = 0;
	for (let i = 0; cartArray.length > i; i++) {
		sum += JSON.parse(cartArray[i].price);
	}
	console.log("Total sum: ", sum);
	sumContainer.innerHTML = `<div><p>Your total sum is: ${sum}</p></div>`;
}
