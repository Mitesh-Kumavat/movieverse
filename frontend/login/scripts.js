import { API_BASE_URL } from "../scripts/util.js";

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (event) => {
    console.log("Login form submitted");

    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }


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
            alert("Login successful!");
            localStorage.setItem("userId", result.userId);
            window.location.href = "/index.html";
        } else {
            alert(result.error || "Login failed. Please try again.");
        }

    } catch (error) {
        console.error("Error during Login:", error);
        alert("An error occurred. Please try again later.");
    }
});
