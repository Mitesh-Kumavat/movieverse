import { API_BASE_URL, showToast } from "../scripts/util.js";

const signupForm = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
const signUpButton = document.querySelector("#signup-btn");

const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden", "opacity-0");
    errorMessage.classList.add("opacity-100");
};

const hideError = () => {
    errorMessage.classList.add("hidden");
    errorMessage.classList.add("opacity-0");
};

const setLoadingButton = () => {
    signUpButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Loading...
    `;
    signUpButton.classList.add("bg-[#f87171]");
    signUpButton.classList.remove("bg-[#e50914]");
    signUpButton.disabled = true;
}

const removeLoadingButton = () => {
    signUpButton.innerHTML = "Sign Up";
    signUpButton.classList.remove("bg-[#f87171]");
    signUpButton.classList.add("bg-[#e50914]");
    signUpButton.disabled = false;
}

const signUp = async (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
        showError("Please fill in all fields.");
        return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        showError("Please enter a valid email password.");
        return;
    }

    if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        showError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return;
    }

    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            showToast("Signup successful!", "/login/index.html");
        } else {
            showError(result.error || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        showError("An error occurred. Please try again later.");
    }
}

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = signupForm.querySelector('#username').value.trim();
    const email = signupForm.querySelector('#email').value.trim();
    const password = signupForm.querySelector('#password').value;
    const confirmPassword = signupForm.querySelector('#password2').value;

    try {
        setLoadingButton();
        await signUp(username, email, password, confirmPassword);
        removeLoadingButton();
    } catch (error) {
        showError("An error occurred. Please try again later.");
        removeLoadingButton();
    }
});
