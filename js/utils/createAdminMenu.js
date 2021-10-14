import { getUsername } from "./storage.js";

export function createAdminMenu() {
	const menuContainer = document.querySelector(".admin-menu-container");

	const username = getUsername();

	const { pathname } = document.location;

	if (username) {
		menuContainer.innerHTML = `<div class="admin-menu">
                                    <a href="addproduct.html" class="admin-link ${
																			pathname === "/addproduct.html"
																				? "active-admin"
																				: ""
																		}">Add Product</a>
                                    <a href="editproduct.html" class="admin-link ${
																			pathname === "/editproduct.html"
																				? "active-admin"
																				: ""
																		}">Edit Product</a>
                                </div>
    `;
	} else {
		menuContainer.innerHTML = "";
	}
}

export function toogleLoginLogout() {
	const toogleLoginLogout = document.querySelector(".toogle-login-logout");

	const username = getUsername();

	const { pathname } = document.location;

	if (username) {
		toogleLoginLogout.innerHTML = `<a href="login.html" class="login-link ${
			pathname === "/login.html" ? "active" : ""
		}">Logout</a>`;
	}
}
