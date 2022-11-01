const url = './api/login.php';
const alerta = document.getElementById("alerta");
const login = document.getElementById("login");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

login.addEventListener('submit', function (e) {
    e.preventDefault();
    const datos = new FormData(login);
    fetch(url, {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data[0].usuario) {
                alerta.innerHTML = `Bienvenido ${data[0].usuario}`;
                sessionStorage.setItem('usuario',data[0].usuario);
                window.location.href = './ofertas.html';
            } else {
                alerta.innerHTML = `${data}`;
            }
            inputUsuario.value = '';
            inputPassword.value = '';
        })
})