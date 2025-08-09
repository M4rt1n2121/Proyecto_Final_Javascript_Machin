
document.addEventListener('DOMContentLoaded', async () => {
    
    await loadUsers();
    
    
    const currentUser = checkAuth();
    const hash = window.location.hash.substring(1);
    
    if (!currentUser && hash !== 'login') {
        window.location.hash = '#login';
    } else if (currentUser && (hash === 'login' || hash === '')) {
        window.location.hash = '#dashboard';
    }
    
    
    if (currentUser) {
        showDashboard(currentUser);
    } else {
        showLoginForm();
    }
    
    
    window.addEventListener('hashchange', () => {
        const user = checkAuth();
        const newHash = window.location.hash.substring(1);
        
        if (!user && newHash !== 'login') {
            window.location.hash = '#login';
        } else if (user && (newHash === 'login' || newHash === '')) {
            window.location.hash = '#dashboard';
        }
        
        if (user) {
            showDashboard(user);
        } else {
            showLoginForm();
        }
    });
});