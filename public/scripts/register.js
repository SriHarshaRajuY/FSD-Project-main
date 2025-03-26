const inputs = document.querySelectorAll(".input");
const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value === "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// Validation functions
function validateUsername(username) {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

// Real-time validation
inputs.forEach((input) => {
    input.addEventListener("input", function() {
        const value = this.value;

        switch (this.name) {
            case "username":
                if (!validateUsername(value) && value !== "") {
                    errorMessage.textContent = "Username: 3-20 chars (letters, numbers, _, - only)";
                } else {
                    errorMessage.textContent = "";
                }
                break;
            case "password":
                if (!validatePassword(value) && value !== "") {
                    errorMessage.textContent = "Password: 8+ chars, 1 upper, 1 number, 1 symbol";
                } else {
                    errorMessage.textContent = "";
                }
                break;
            case "email":
                if (!validateEmail(value) && value !== "") {
                    errorMessage.textContent = "Invalid email format";
                } else {
                    errorMessage.textContent = "";
                }
                break;
            case "mobile":
                if (!validateMobile(value) && value !== "") {
                    errorMessage.textContent = "Mobile must be exactly 10 digits";
                } else {
                    errorMessage.textContent = "";
                }
                break;
        }
    });
});

form.addEventListener("submit", (e) => {
    const username = form.querySelector("input[name='username']").value;
    const password = passwordInput.value;
    const email = form.querySelector("input[name='email']").value;
    const mobile = form.querySelector("input[name='mobile']").value;
    const role = form.querySelector("select[name='role']").value;

    if (!validateUsername(username)) {
        e.preventDefault();
        errorMessage.textContent = "Invalid username format";
        return;
    }

    if (!validatePassword(password)) {
        e.preventDefault();
        errorMessage.textContent = "Invalid password format";
        return;
    }

    if (!validateEmail(email)) {
        e.preventDefault();
        errorMessage.textContent = "Invalid email format";
        return;
    }

    if (!validateMobile(mobile)) {
        e.preventDefault();
        errorMessage.textContent = "Mobile number must be exactly 10 digits";
        return;
    }

    if (!role) {
        e.preventDefault();
        errorMessage.textContent = "Please select a role";
        return;
    }
});