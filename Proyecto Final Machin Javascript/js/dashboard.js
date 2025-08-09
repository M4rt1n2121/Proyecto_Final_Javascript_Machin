
const validRoutes = ['dashboard', 'deposit', 'withdraw', 'transfer', 'third-party'];


function showDashboard(user) {
    document.getElementById('app').innerHTML = `
        <div class="dashboard">
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-university"></i>
                    <h2>Coder Banco</h2>
                </div>
                <ul class="sidebar-menu">
                    <li><a href="#dashboard" class="active"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="#deposit"><i class="fas fa-money-bill-wave"></i> Depósitos</a></li>
                    <li><a href="#withdraw"><i class="fas fa-hand-holding-usd"></i> Retiros</a></li>
                    <li><a href="#transfer"><i class="fas fa-exchange-alt"></i> Transferencias</a></li>
                    <li><a href="#third-party"><i class="fas fa-user-friends"></i> A terceros</a></li>
                    <li><a href="#" id="logout"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</a></li>
                </ul>
            </aside>
            <main class="main-content">
                <div class="header">
                    <div class="welcome-message">
                        <h2>Hola, ${user.name}</h2>
                        <p>Bienvenido a tu banca digital</p>
                    </div>
                    <div class="date-time" id="dateTime"></div>
                </div>
                
                <section class="accounts-section">
                    <h3 class="section-title"><i class="fas fa-wallet"></i> Mis Cuentas</h3>
                    <div class="accounts-grid" id="accountsGrid"></div>
                </section>
                
                <section class="transactions-section" id="transactionsSection">
                    <!-- Contenido dinámico -->
                </section>

                <section class="recent-transactions">
                    <h3 class="section-title"><i class="fas fa-history"></i> Actividad Reciente</h3>
                    <div class="transactions-list" id="transactionsList"></div>
                </section>
            </main>
        </div>
    `;
    
    
    renderAccounts(user.accounts);
    
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    
    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
   
    handleRoute();
}


function renderAccounts(accounts) {
    const accountsGrid = document.getElementById('accountsGrid');
    accountsGrid.innerHTML = accounts.map(account => `
        <div class="account-card">
            <h4 class="account-type">${account.type}</h4>
            <p class="account-number">N° ${account.id}</p>
            <p class="account-balance">${formatCurrency(account.balance, account.currency)}</p>
        </div>
    `).join('');
}

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

function updateDateTime() {
    const now = luxon.DateTime.now();
    document.getElementById('dateTime').textContent = now.toLocaleString({
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
function renderRecentTransactions(transactions) {
    if (!transactions || transactions.length === 0) {
        return '<p>No hay actividad reciente</p>';
    }
    
    return `
        <table class="transactions-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Operación</th>
                    <th>Monto</th>
                    <th>Cuenta</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.slice(0, 5).map(t => `
                    <tr>
                        <td>${new Date(t.date).toLocaleDateString()}</td>
                        <td>${getTransactionType(t.type)}</td>
                        <td class="${t.amount > 0 ? 'text-success' : 'text-danger'}">
                            ${formatCurrency(Math.abs(t.amount), t.currency || 'ARS')}
                        </td>
                        <td>${t.account}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getTransactionType(type) {
    const types = {
        'deposit': 'Depósito',
        'withdraw': 'Retiro',
        'transfer': 'Transferencia',
        'third-party': 'Transferencia a terceros'
    };
    return types[type] || type;
}
function handleRoute() {
    const hash = window.location.hash.substring(1);
    const user = checkAuth();
    
    if (!user) {
        window.location.hash = '#login';
        return;
    }
    
    if (!validRoutes.includes(hash)) {
        window.location.hash = '#dashboard';
        return;
    }

    const transactionsSection = document.getElementById('transactionsSection');
    
    switch(hash) {
        case 'dashboard':
            transactionsSection.innerHTML = `
                <h3 class="section-title"><i class="fas fa-chart-line"></i> Resumen</h3>
                <p>Selecciona una opción del menú para realizar operaciones.</p>
            `;
            break;
        case 'deposit':
            renderDepositForm(user);
            break;
        case 'withdraw':
            renderWithdrawForm(user);
            break;
        case 'transfer':
            renderTransferForm(user);
            break;
        case 'third-party':
            renderThirdPartyForm(user);
            break;
        default:
            window.location.hash = '#dashboard';
    }
}

window.addEventListener('hashchange', handleRoute);