const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx_EH8GCXWui-Efo1C0pSrbg0kgfsRsymHnt5JaFPyBFxaz4RkfbtbQ0o8efeVKrR2rBA/exec";

async function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const msg = document.getElementById("msg");
    const btn = document.querySelector("button");

    // 1. Kirish maydonlarini tekshirish
    if (!user || !pass) {
        msg.innerHTML = "<span style='color: red;'>Login va parolni kiriting!</span>";
        return;
    }

    msg.innerHTML = "<span style='color: blue;'>Tekshirilmoqda...</span>";
    btn.disabled = true;

    try {
        // 2. Google Script (Backend) ga so'rov yuborish
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "login",
                username: user,
                password: pass
            })
        });

        const result = await response.json();

        // 3. Natijani tekshirish
        if (result.status === "success") {
            // Sessiya ma'lumotlarini saqlash
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", user);
            localStorage.setItem("userRole", result.role); // 'admin' yoki 'instructor' saqlanadi

            msg.innerHTML = `<span style='color: green;'>${result.message} Yo'naltirilmoqda...</span>`;

            // 4. Rolga qarab turli sahifalarga yo'naltirish
            setTimeout(() => {
                if (result.role === "admin") {
                    window.location.href = "dashboard.html";
                } else if (result.role === "instructor") {
                    window.location.href = "instructor-scan.html";
                } else {
                    // Agar kutilmagan rol kelsa (xavfsizlik uchun)
                    msg.innerHTML = "<span style='color: orange;'>Noma'lum ruxsatnoma!</span>";
                    btn.disabled = false;
                }
            }, 1500);

        } else {
            // Xato bo'lsa (Login yoki parol xato)
            msg.innerHTML = `<span style='color: red;'>${result.message}</span>`;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Xatolik:", error);
        msg.innerHTML = "<span style='color: red;'>Server bilan bog'lanishda xato yuz berdi!</span>";
        btn.disabled = false;
    }
}

// "Enter" tugmasini bosganda ishlashi uchun
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        login();
    }
});