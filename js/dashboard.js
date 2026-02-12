// Foydalanuvchi ismini ko'rsatish
document.getElementById('adminName').innerText = localStorage.getItem("currentUser") || "Admin";

// Tizimdan chiqish
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Mobil menyuni ochish/yopish
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Sahifa o'zgarganda menyuni yopish (mobil qurilmalarda)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    });
});