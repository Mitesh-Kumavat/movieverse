import { API_BASE_URL } from "../scripts/util.js";

const signupForm = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");

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

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = signupForm.querySelector('#username').value.trim();
    const email = signupForm.querySelector('#email').value.trim();
    const password = signupForm.querySelector('#password').value;
    const confirmPassword = signupForm.querySelector('#password2').value;

    if (!username || !email || !password || !confirmPassword) {
        showError("Please fill in all fields.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            alert("Signup successful! You can now log in.");
            window.location.href = "/login";
        } else {
            showError(result.error || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        showError("An error occurred. Please try again later.");
    }
});
