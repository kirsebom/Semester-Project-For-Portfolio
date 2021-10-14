const logoutButton = document.querySelector(".logout-button");

logoutButton.addEventListener("click", logout);

function logout() {
	if (confirm("Are you sure you want to logout?")) {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		location.href = "/login.html";
	}
}
