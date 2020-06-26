// Name and Password from the register-form
var name = document.getElementById('email_storage');
var pw = document.getElementById('password_storage');

// storing input from register-form
function store() {
    localStorage.setItem('email_storage', email.value);
    localStorage.setItem('login_storage', login.value);
    localStorage.setItem('password_storage', password.value);
}

// check if stored data from register-form is equal to entered data in the   login-form
function check() {

    // stored data from the register-form
    var storedEmail = localStorage.getItem('email_storage');
    var storedLogin = localStorage.getItem('login_storage');
    var storedPw = localStorage.getItem('password_storage');

    // entered data from the login-form
    var userEmail = document.getElementById('log_email');
    var userPassword = document.getElementById('log_password');

    // check if stored data from register-form is equal to data from login form
    if(userEmail.value == storedEmail && userPassword.value == storedPw) {
        alert('You are loged in.');
        alert('ERROR');
    }else {
        alert('ERROR');
    }
}