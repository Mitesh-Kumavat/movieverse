import { API_BASE_URL } from "../scripts/util.js";

const loginForm = document.querySelector("form");
const loginButton = document.querySelector("#login-btn");
const errorMessage = document.querySelector(".error-message");

const setLoadingButton = () => {
    loginButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Loading...
    `;
    loginButton.classList.add("bg-[#f87171]");
    loginButton.classList.remove("bg-[#e50914]");
    loginButton.disabled = true;
};

const removeLoadingButton = () => {
    loginButton.innerHTML = "Log In"; // Restore original button text
    loginButton.classList.remove("bg-[#f87171]");
    loginButton.classList.add("bg-[#e50914]");
    loginButton.disabled = false;
};


const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden", "opacity-0");
    errorMessage.classList.add("opacity-100");
};

const hideError = () => {
    errorMessage.classList.add("opacity-0");
    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 300);
};

const login = async (email, password) => {
    if (!email || !password) {
        showError("Please fill in all fields.");
        return;
    }
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });


        const result = await response.json();

        if (response.ok) {
            showError("Login successful!");
            localStorage.setItem("userId", result.userId);
            window.location.href = "../index.html";
        } else {
            showError(result.error || "Login failed. Please try again.");
        }

    } catch (error) {
        console.error("Error during Login:", error);
        showError("An error occurred. Please try again later.");
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    try {
        setLoadingButton();
        await login(email, password);
        removeLoadingButton();
    } catch (error) {
        showError("An error occurred. Please try again later.");
        removeLoadingButton();
    }

});
