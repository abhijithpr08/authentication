const form = document.getElementById("signupForm");

if (form) {

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm").value;

        const msg = document.getElementById("msg");

        if (password !== confirm) {
            msg.style.color = "red";
            msg.innerText = "Passwords do not match";
            return;
        }

        try {
            const res = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirm
                })
            });

            const data = await res.text();

            msg.style.color = "green";
            msg.innerHTML = data;

            form.reset();

        } catch (err) {
            msg.style.color = "red";
            msg.innerText = "Server Error";
        }

    });

}
