const html5QrCode = new Html5Qrcode("reader");
let scannedResult = "";

const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

// Skanerni ishga tushirish
html5QrCode.start(
    { facingMode: "environment" }, // Orqa kamera
    qrConfig,
    onScanSuccess
).catch(err => console.error("Kamera ochilmadi:", err));

function onScanSuccess(decodedText, decodedResult) {
    try {
        // 1. Base64 dan oddiy matnga o'tkazamiz (atob funksiyasi orqali)
        // UTF-8 belgilar (o' , g') to'g'ri chiqishi uchun decodeURIComponent ishlatamiz
        const decodedString = decodeURIComponent(escape(window.atob(decodedText)));

        // 2. JSON ob'ektiga aylantiramiz
        const data = JSON.parse(decodedString);

        // 3. Skanerni to'xtatish
        html5QrCode.stop();

        // 4. Instruktorga natijani chiroyli ko'rinishda chiqarish
        const resultDiv = document.getElementById("qr-result");
        resultDiv.innerHTML = `
            <div class="client-info">
                <p><strong>🆔 ID:</strong> ${data.ID}</p>
                <p><strong>👤 Mijoz:</strong> ${data.FullName}</p>
                <p><strong>🏢 Markaz:</strong> ${data.CenterName}</p>
                <p><strong>📚 Kurs:</strong> ${data.CourseName}</p>
                <p><strong>💰 To'lov:</strong> ${data.Amount} so'm (${data.PaymentType})</p>
                <p><strong>⏳ Vaqt:</strong> ${data.Hours}</p>
                <p><strong>📅 Sana:</strong> ${data.CreatedDate}</p>
            </div>
        `;

        // Oynalarni almashtirish
        document.getElementById("result-box").classList.remove("hidden");
        document.getElementById("reader").classList.add("hidden");

        // Ma'lumotni saqlash uchun global o'zgaruvchiga olamiz
        window.currentScanData = data;

    } catch (e) {
        console.error("Dekodlashda xatolik:", e);
        alert("Xato: QR kod formati noto'g'ri yoki ma'lumot o'qib bo'lmadi!");
        restartScanner();
    }
}

function restartScanner() {
    location.reload(); // Sahifani yangilab skanerni qayta yoqish
}

async function sendToGoogleSheet() {
    const msg = document.getElementById("status-msg");
    const WEB_APP_URL = "SIZNING_WEB_APP_URL_MANZILINGIZ";

    msg.innerText = "Yuborilmoqda...";

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "scanResult", // Google Scriptda yangi action yaratamiz
                instructor: localStorage.getItem("currentUser"),
                data: scannedResult,
                timestamp: new Date().toLocaleString()
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