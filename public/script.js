const form = document.getElementById("signupForm");

if (form) {

    form.addEventListener("submit", function(event) {

        const pass = document.getElementById("password").value;
        const confirm = document.getElementById("confirm").value;
        const msg = document.getElementById("msg");

        if (pass !== confirm) {
            event.preventDefault();
            msg.style.color = "red";
            msg.innerText = "Passwords do not match";
        }

    });

}
