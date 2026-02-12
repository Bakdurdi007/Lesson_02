alert("Skaner kodi yangilandi! v3.0");
const html5QrCode = new Html5Qrcode("reader");
let currentDataObj = null; // Global ob'ekt

const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode.start(
    { facingMode: "environment" },
    qrConfig,
    onScanSuccess
).catch(err => console.error("Kamera ochilmadi:", err));

function onScanSuccess(decodedText, decodedResult) {
    // Skanerlanganda nima kelayotganini ko'rish uchun
    console.log("Original:", decodedText);

    try {
        // Base64 dan decode qilish
        // window.atob - bazaviy decode
        // escape/decodeURIComponent - o'zbekcha harflar uchun
        let decodedString = decodeURIComponent(escape(window.atob(decodedText)));
        let data = JSON.parse(decodedString);

        currentDataObj = data;
        html5QrCode.stop();

        // Natijani jadval ko'rinishida chiqarish
        const resultDiv = document.getElementById("qr-result");
        resultDiv.innerHTML = `
            <div style="text-align: left; background: #f0f0f0; padding: 15px; border-radius: 10px; border: 2px solid #3498db;">
                <p><b>👤 Ism:</b> ${data.FullName}</p>
                <p><b>🏢 Markaz:</b> ${data.CenterName}</p>
                <p><b>📚 Kurs:</b> ${data.CourseName}</p>
                <p><b>💰 Summa:</b> ${data.Amount} so'm</p>
                <p><b>⏳ Vaqt:</b> ${data.Hours}</p>
                <p><b>📅 Sana:</b> ${data.CreatedDate}</p>
            </div>
        `;

        document.getElementById("result-box").classList.remove("hidden");
        document.getElementById("reader").classList.add("hidden");

    } catch (e) {
        // Agar decoding xato bersa, xatolikni ko'rsatish
        alert("Decoding xatosi: " + e.message);
        document.getElementById("qr-result").innerText = decodedText;
        document.getElementById("result-box").classList.remove("hidden");
    }
}

function restartScanner() {
    window.location.href = window.location.href.split('?')[0] + "?t=" + new Date().getTime();
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