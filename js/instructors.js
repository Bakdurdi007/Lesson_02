const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx_EH8GCXWui-Efo1C0pSrbg0kgfsRsymHnt5JaFPyBFxaz4RkfbtbQ0o8efeVKrR2rBA/exec";

async function saveInstructor() {
    const id = "";
    const name = document.getElementById("instName").value;
    const login = document.getElementById("instLogin").value;
    const pass = document.getElementById("instPass").value;
    const hourlyR = document.getElementById("hourlyRate").value;
    const msg = document.getElementById("statusMsg");
    const btn = document.getElementById("saveBtn");

    if (!name || !login || !pass || !hourlyR) {
        msg.innerHTML = "<span style='color: red;'>Barcha maydonlarni to'ldiring!</span>";
        return;
    }

    btn.disabled = true;
    btn.innerText = "Saqlanmoqda...";

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "addInstructor",
                id: id,
                fullName: name,
                login: login,
                password: pass,
                hourlyRate: hourlyR
            })
        });

        const result = await response.json();

        if (result.status === "success") {
            msg.innerHTML = "<span style='color: green;'>Muvaffaqiyatli saqlandi!</span>";
            // Formani tozalash
            document.querySelectorAll("input").forEach(i => i.value = "");
        }
    } catch (error) {
        msg.innerHTML = "<span style='color: red;'>Xatolik yuz berdi!</span>";
    } finally {
        btn.disabled = false;
        btn.innerText = "Saqlash";
    }
}