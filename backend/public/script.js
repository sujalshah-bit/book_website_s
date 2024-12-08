document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const signupForm = document.getElementById('admin-signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:5000/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                loginMessage.textContent = 'Login successful! Token: ' + data.token;
                loginMessage.style.color = 'green';
            } else {
                loginMessage.textContent = data.message || 'Login failed';
            }
        } catch (error) {
            loginMessage.textContent = 'Error: ' + error.message;
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        console.log(username, password)

        try {
            const response = await fetch('http://localhost:5000/admin/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log(response)
            const data = await response.json();
            console.log(data)

            if (response.ok) {
                signupMessage.textContent = 'Signup successful!';
                signupMessage.style.color = 'green';
            } else {
                signupMessage.textContent = data.message || 'Signup failed';
            }
        } catch (error) {
            signupMessage.textContent = 'Error: ' + error.message;
        }
    });
});
