const password = "Qewerty@123passpassword";

const passwordChecker = (password) => {
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const length = password.length >= 8;
    const pass = /pass/i.test(password);
    const word = /password/i.test(password);

    if (password) {
        if (uppercase && lowercase && number && special && length && !pass && !word) {
            return "Password is strong";
        } else {
            return "Password is weak";
        }
    } else {
        return "Password cannot be empty";
    }
};


console.log(passwordChecker(password))