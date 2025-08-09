

function renderDepositForm(user) {

    document.getElementById('transactionsSection').innerHTML = `

        <h3 class="section-title"><i class="fas fa-money-bill-wave"></i> Realizar Depósito</h3>

        <form id="depositForm">

            <div class="transaction-form">

                <div class="form-group">

                    <label for="depositAccount">Cuenta destino</label>

                    <select id="depositAccount" required>

                        ${user.accounts.map(account => `

                            <option value="${account.id}">${account.type} (${account.id}) - ${formatCurrency(account.balance, account.currency)}</option>

                        `).join('')}

                    </select>

                </div>

                <div class="form-group">

                    <label for="depositAmount">Monto</label>

                    <input type="number" id="depositAmount" min="1" step="0.01" required>

                </div>

                <div class="form-group">

                    <label for="depositDescription">Descripción</label>

                    <input type="text" id="depositDescription" placeholder="Concepto del depósito">

                </div>

            </div>

            <button type="submit" class="btn btn-primary">Depositar</button>

        </form>

    `;

    

    document.getElementById('depositForm').addEventListener('submit', (e) => {

        e.preventDefault();

        handleDeposit(user);

    });

}





function handleDeposit(user) {

    const accountId = document.getElementById('depositAccount').value;

    const amount = parseFloat(document.getElementById('depositAmount').value);

    const description = document.getElementById('depositDescription').value;

    

    const account = user.accounts.find(acc => acc.id === accountId);

    

    if (account) {

        account.balance += amount;

        

        

        sessionStorage.setItem('currentUser', JSON.stringify(user));

        

        Swal.fire({

            icon: 'success',

            title: 'Depósito realizado',

            text: `Has depositado ${formatCurrency(amount, account.currency)} a tu ${account.type}`,

            confirmButtonColor: '#1a237e'

        }).then(() => {

            

            renderAccounts(user.accounts);

            window.location.hash = '#dashboard';

        });

    }

}





function renderWithdrawForm(user) {

    document.getElementById('transactionsSection').innerHTML = `

        <h3 class="section-title"><i class="fas fa-hand-holding-usd"></i> Realizar Retiro</h3>

        <form id="withdrawForm">

            <div class="transaction-form">

                <div class="form-group">

                    <label for="withdrawAccount">Cuenta origen</label>

                    <select id="withdrawAccount" required>

                        ${user.accounts.map(account => `

                            <option value="${account.id}">${account.type} (${account.id}) - ${formatCurrency(account.balance, account.currency)}</option>

                        `).join('')}

                    </select>

                </div>

                <div class="form-group">

                    <label for="withdrawAmount">Monto</label>

                    <input type="number" id="withdrawAmount" min="1" step="0.01" required>

                </div>

                <div class="form-group">

                    <label for="withdrawDescription">Descripción</label>

                    <input type="text" id="withdrawDescription" placeholder="Concepto del retiro">

                </div>

            </div>

            <button type="submit" class="btn btn-primary">Retirar</button>

        </form>

    `;

    

    document.getElementById('withdrawForm').addEventListener('submit', (e) => {

        e.preventDefault();

        handleWithdraw(user);

    });

}





function handleWithdraw(user) {

    const accountId = document.getElementById('withdrawAccount').value;

    const amount = parseFloat(document.getElementById('withdrawAmount').value);

    const description = document.getElementById('withdrawDescription').value;

    

    const account = user.accounts.find(acc => acc.id === accountId);

    

    if (account) {

        if (account.balance >= amount) {

            account.balance -= amount;

            

            

            sessionStorage.setItem('currentUser', JSON.stringify(user));

            

            Swal.fire({

                icon: 'success',

                title: 'Retiro realizado',

                text: `Has retirado ${formatCurrency(amount, account.currency)} de tu ${account.type}`,

                confirmButtonColor: '#1a237e'

            }).then(() => {

                

                renderAccounts(user.accounts);

                window.location.hash = '#dashboard';

            });

        } else {

            Swal.fire({

                icon: 'error',

                title: 'Fondos insuficientes',

                text: `No tienes suficiente saldo en tu ${account.type}`,

                confirmButtonColor: '#1a237e'

            });

        }

    }

}





function renderTransferForm(user) {

    document.getElementById('transactionsSection').innerHTML = `

        <h3 class="section-title"><i class="fas fa-exchange-alt"></i> Transferencia entre Cuentas</h3>

        <form id="transferForm">

            <div class="transaction-form">

                <div class="form-group">

                    <label for="fromAccount">Cuenta origen</label>

                    <select id="fromAccount" required>

                        ${user.accounts.map(account => `

                            <option value="${account.id}">${account.type} (${account.id}) - ${formatCurrency(account.balance, account.currency)}</option>

                        `).join('')}

                    </select>

                </div>

                <div class="form-group">

                    <label for="toAccount">Cuenta destino</label>

                    <select id="toAccount" required>

                        ${user.accounts.map(account => `

                            <option value="${account.id}">${account.type} (${account.id}) - ${formatCurrency(account.balance, account.currency)}</option>

                        `).join('')}

                    </select>

                </div>

                <div class="form-group">

                    <label for="transferAmount">Monto</label>

                    <input type="number" id="transferAmount" min="1" step="0.01" required>

                </div>

                <div class="form-group">

                    <label for="transferDescription">Descripción</label>

                    <input type="text" id="transferDescription" placeholder="Concepto de la transferencia">

                </div>

            </div>

            <button type="submit" class="btn btn-primary">Transferir</button>

        </form>

    `;

    

    document.getElementById('transferForm').addEventListener('submit', (e) => {

        e.preventDefault();

        handleTransfer(user);

    });

}





function handleTransfer(user) {

    const fromAccountId = document.getElementById('fromAccount').value;

    const toAccountId = document.getElementById('toAccount').value;

    const amount = parseFloat(document.getElementById('transferAmount').value);

    const description = document.getElementById('transferDescription').value;

    

    if (fromAccountId === toAccountId) {

        Swal.fire({

            icon: 'error',

            title: 'Error en transferencia',

            text: 'No puedes transferir a la misma cuenta',

            confirmButtonColor: '#1a237e'

        });

        return;

    }

    

    const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);

    const toAccount = user.accounts.find(acc => acc.id === toAccountId);

    

    if (fromAccount && toAccount) {

        if (fromAccount.currency !== toAccount.currency) {

            Swal.fire({

                icon: 'error',

                title: 'Error en transferencia',

                text: 'No puedes transferir entre cuentas con diferentes monedas',

                confirmButtonColor: '#1a237e'

            });

            return;

        }

        

        if (fromAccount.balance >= amount) {

            fromAccount.balance -= amount;

            toAccount.balance += amount;

            

            

            sessionStorage.setItem('currentUser', JSON.stringify(user));

            

            Swal.fire({

                icon: 'success',

                title: 'Transferencia realizada',

                text: `Has transferido ${formatCurrency(amount, fromAccount.currency)} desde tu ${fromAccount.type} a tu ${toAccount.type}`,

                confirmButtonColor: '#1a237e'

            }).then(() => {

                

                renderAccounts(user.accounts);

                window.location.hash = '#dashboard';

            });

        } else {

            Swal.fire({

                icon: 'error',

                title: 'Fondos insuficientes',

                text: `No tienes suficiente saldo en tu ${fromAccount.type}`,

                confirmButtonColor: '#1a237e'

            });

        }

    }

}





function renderThirdPartyForm(user) {

    document.getElementById('transactionsSection').innerHTML = `

        <h3 class="section-title"><i class="fas fa-user-friends"></i> Transferencia a Terceros</h3>

        <form id="thirdPartyForm">

            <div class="transaction-form">

                <div class="form-group">

                    <label for="thirdFromAccount">Cuenta origen</label>

                    <select id="thirdFromAccount" required>

                        ${user.accounts.map(account => `

                            <option value="${account.id}">${account.type} (${account.id}) - ${formatCurrency(account.balance, account.currency)}</option>

                        `).join('')}

                    </select>

                </div>

                <div class="form-group">

                    <label for="thirdToCBU">CBU/CVU destino</label>

                    <input type="text" id="thirdToCBU" placeholder="Ingrese el CBU/CVU" required>

                </div>

                <div class="form-group">

                    <label for="thirdToName">Nombre del beneficiario</label>

                    <input type="text" id="thirdToName" placeholder="Nombre completo" required>

                </div>

                <div class="form-group">

                    <label for="thirdAmount">Monto</label>

                    <input type="number" id="thirdAmount" min="1" step="0.01" required>

                </div>

                <div class="form-group">

                    <label for="thirdDescription">Descripción</label>

                    <input type="text" id="thirdDescription" placeholder="Concepto de la transferencia">

                </div>

            </div>

            <button type="submit" class="btn btn-primary">Transferir</button>

        </form>

    `;

    

    document.getElementById('thirdPartyForm').addEventListener('submit', (e) => {

        e.preventDefault();

        handleThirdPartyTransfer(user);

    });

}





function handleThirdPartyTransfer(user) {

    const fromAccountId = document.getElementById('thirdFromAccount').value;

    const toCBU = document.getElementById('thirdToCBU').value;

    const toName = document.getElementById('thirdToName').value;

    const amount = parseFloat(document.getElementById('thirdAmount').value);

    const description = document.getElementById('thirdDescription').value;

    

    const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);

    

    if (fromAccount) {

        if (fromAccount.balance >= amount) {

            fromAccount.balance -= amount;

            

            

            sessionStorage.setItem('currentUser', JSON.stringify(user));

            

            Swal.fire({

                icon: 'success',

                title: 'Transferencia realizada',

                html: `

                    <p>Has transferido ${formatCurrency(amount, fromAccount.currency)} a:</p>

                    <p><strong>Nombre:</strong> ${toName}</p>

                    <p><strong>CBU/CVU:</strong> ${toCBU}</p>

                    ${description ? `<p><strong>Concepto:</strong> ${description}</p>` : ''}

                `,

                confirmButtonColor: '#1a237e'

            }).then(() => {

                

                renderAccounts(user.accounts);

                window.location.hash = '#dashboard';

            });

        } else {

            Swal.fire({

                icon: 'error',

                title: 'Fondos insuficientes',

                text: `No tienes suficiente saldo en tu ${fromAccount.type}`,

                confirmButtonColor: '#1a237e'

            });

        }

    }

}