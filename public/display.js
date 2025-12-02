fetch("/users")
    .then(res => res.json())
    .then(users => {
        const list = document.getElementById("userList");
        if (users.length === 0) {
            list.innerHTML = "<p>No users registered.</p>";
            return;
        }
        users.forEach((user, index) => {
            list.innerHTML += `
                <p>
                   <b>${index + 1}.</b>
                   ${user.name} - ${user.email}
                </p>
            `;
        });
    });
