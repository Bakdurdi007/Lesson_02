const html5QrCode = new Html5Qrcode("reader");
let currentDataObj = null; // Global ob'ekt

const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode.start(
    { facingMode: "environment" },
    qrConfig,
    onScanSuccess
).catch(err => console.error("Kamera ochilmadi:", err));

function onScanSuccess(decodedText, decodedResult) {
    console.log("Skanerlandi:", decodedText); // Debug uchun konsolga chiqarish

    try {
        // Base64 decode
        const decodedString = decodeURIComponent(escape(window.atob(decodedText)));
        const data = JSON.parse(decodedString);
        currentDataObj = data; // Ma'lumotni saqlab qo'yamiz

        html5QrCode.stop();

        const resultDiv = document.getElementById("qr-result");
        // MA'LUMOTLARNI CHIQARISH
        resultDiv.innerHTML = `
            <div class="client-info" style="text-align: left; background: #f4f4f4; padding: 15px; border-radius: 8px;">
                <p><strong>🆔 ID:</strong> ${data.ID || 'Noma\'lum'}</p>
                <p><strong>👤 Mijoz:</strong> ${data.FullName || 'Noma\'lum'}</p>
                <p><strong>🏢 Markaz:</strong> ${data.CenterName || 'Noma\'lum'}</p>
                <p><strong>📚 Kurs:</strong> ${data.CourseName || 'Noma\'lum'}</p>
                <p><strong>💰 To'lov:</strong> ${data.Amount} so'm</p>
                <p><strong>⏳ Vaqt:</strong> ${data.Hours}</p>
                <p><strong>📅 Sana:</strong> ${data.CreatedDate}</p>
            </div>
        `;

        document.getElementById("result-box").classList.remove("hidden");
        document.getElementById("reader").classList.add("hidden");

    } catch (e) {
        console.error("Xato:", e);
        // Agar Base64 bo'lmasa, oddiy matn deb hisoblaymiz
        document.getElementById("qr-result").innerText = "Xom ma'lumot: " + decodedText;
        document.getElementById("result-box").classList.remove("hidden");
    }
}

function restartScanner() {
    window.location.reload(true); // Sahifani qattiq yangilash (keshni tozalash uchun)
}

async function sendToGoogleSheet() {
    const msg = document.getElementById("status-msg");
    const WEB_APP_URL = "SIZNING_WEB_APP_URL_MANZILINGIZ";

    if (!currentDataObj) {
        msg.innerText = "Skanerlangan ma'lumot topilmadi!";
        return;
    }

    msg.innerText = "Yuborilmoqda...";

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "scanResult",
                instructor: localStorage.getItem("currentUser"),
                // Endi hamma ma'lumotni alohida yuboramiz
                clientId: currentDataObj.ID,
                clientName: currentDataObj.FullName,
                hours: currentDataObj.Hours,
                amount: currentDataObj.Amount
            })
        });

        const res = await response.json();
        if(res.status === "success") {
            msg.innerHTML = "<span style='color:green'>Muvaffaqiyatli saqlandi!</span>";
        }
    } catch (error) {
        msg.innerHTML = "<span style='color:red'>Xatolik yuz berdi!</span>";
    }
}