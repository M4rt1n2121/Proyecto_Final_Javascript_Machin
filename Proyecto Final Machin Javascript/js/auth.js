
const users = [];


async function loadUsers() {
    try {
        const response = await fetch('data/users.json');
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        const data = await response.json();
        users.push(...data);
        return true;
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error del sistema',
            text: 'No se pudieron cargar los datos. Por favor intente más tarde.',
            confirmButtonColor: '#1a237e'
        });
        return false;
    }
}


function showLoginForm() {
    document.getElementById('app').innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <div class="logo">
                    <i class="fas fa-piggy-bank"></i>
                </div>
                <h1>Banco Digital</h1>
                <form id="loginForm">
                    <div class="form-group">
                        <input type="text" id="username" placeholder="Usuario" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" placeholder="Contraseña" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Ingresar</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}


async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacíos',
            text: 'Por favor complete todos los campos',
            confirmButtonColor: '#1a237e'
        });
        return;
    }

    try {
        if (users.length === 0) {
            const loaded = await loadUsers();
            if (!loaded) return;
        }
        
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password
        );
        
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            await Swal.fire({
                icon: 'success',
                title: `Bienvenido, ${user.name}`,
                showConfirmButton: false,
                timer: 1500
            });
            
            window.location.hash = '#dashboard';
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Credenciales incorrectas',
                text: 'Por favor verifica tu usuario y contraseña',
                confirmButtonColor: '#ff0a0aff'
            });
        }
    } catch (error) {
        console.error("Error en login:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error en el sistema',
            text: 'Ocurrió un error durante el login'
        });
    }
}


function checkAuth() {
    try {
        const userData = sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error al verificar autenticación:", error);
        return null;
    }
}


function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.hash = '#login';
    window.dispatchEvent(new HashChangeEvent("hashchange"));
}