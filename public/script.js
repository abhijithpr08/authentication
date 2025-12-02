const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name     = document.getElementById("name").value;
    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm  = document.getElementById("confirm").value;

    const msg = document.getElementById("msg");

    if (password !== confirm) {
        msg.innerText = "Passwords do not match";
        return;
    }

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            password,
            confirm
        })
    });

    const result = await response.text();

    msg.innerText = result;

    form.reset();
});
