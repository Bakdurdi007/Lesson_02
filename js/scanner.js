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
    scannedResult = decodedText;

    // Skanerni to'xtatish
    html5QrCode.stop();

    document.getElementById("qr-result").innerText = decodedText;
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("reader").classList.add("hidden");
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