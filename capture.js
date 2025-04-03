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

    // แปลงภาพเป็น Data URL
    const imageData = canvas.toDataURL('image/png');

    // แสดงภาพที่ถ่าย
    displayPhoto(imageData);
}

function displayPhoto(imageData) {
    const img = document.createElement('img');
    img.src = imageData;
    img.style.width = "100%"; // ปรับขนาดให้เหมาะสม
    document.body.appendChild(img); // เพิ่มรูปภาพลงในหน้าเว็บ
}

// เริ่มทำงานเมื่อหน้าโหลด
startCamera();
