let cameraAttempts = 0;
let currentPage = 1;
let wrongCount = 0;
let score = 0;
let userPhoto = null;
let isRequesting = false;

const pages = document.querySelectorAll('.page');
const message = document.getElementById('message');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// แก้ไข Event Listener ของปุ่มเริ่มเกม
document.getElementById('startBtn').addEventListener('click', async function() {
    this.disabled = true;
    try {
        await initCamera();
    } finally {
        setTimeout(() => this.disabled = false, 3000);
    }
});

function showPage(pageNumber) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;
}

// แก้ไขฟังก์ชัน initCamera
async function initCamera() {
    if (isRequesting) return;
    isRequesting = true;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        video.srcObject = stream;
        await video.play();
        takePhoto();
        showPage(2);
        cameraAttempts = 0;
    } catch (err) {
        await handleCameraError();
    } finally {
        isRequesting = false;
    }
}

function takePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    userPhoto = canvas.toDataURL('image/png');
}

// แก้ไขฟังก์ชัน handleCameraError
async function handleCameraError() {
    cameraAttempts++;
    
    const messages = [
        { text: 'หากไม่อนุญาตจะไม่สามารถเล่นเกมนี้ได้', delay: 3000 },
        { text: 'โปรดกดอนุญาตเพื่อเล่นเกม', delay: 3000 },
        { text: 'งั้นก็ไม่ต้องเล่น', delay: 2000 }
    ];
    
    const currentMessage = messages[cameraAttempts - 1];
    await showMessageWithDelay(currentMessage.text, currentMessage.delay);

    if(cameraAttempts >= 3) {
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 2000);
        return;
    }

    // ขออนุญาตอีกครั้งหลังจากแสดงข้อความเสร็จ
    initCamera(); 
}

// แก้ไขฟังก์ชันแสดงข้อความ
function showMessage(text) {
    message.textContent = text;
    message.style.display = 'block';
}

function hideMessage() {
    message.style.display = 'none';
}

 // แสดงปุ่มให้ผู้ใช้กดเพื่อลองอีกครั้ง
    showRetryButton();
}

// ฟังก์ชันแสดงข้อความพร้อมหน่วงเวลา
function showMessageWithDelay(text, delay) {
    return new Promise(resolve => {
        showMessage(text);
        setTimeout(() => {
            hideMessage();
            resolve();
        }, delay);
    });
}

// ฟังก์ชันแสดงปุ่มลองอีกครั้ง
function showRetryButton() {
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'ลองอีกครั้ง';
    retryBtn.className = 'play-btn';
    retryBtn.style.marginTop = '20px';
    retryBtn.onclick = () => {
        retryBtn.remove();
        initCamera();
    };
    document.getElementById('page1').appendChild(retryBtn);
}

// Game Logic
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        if(this.classList.contains('correct')) {
            handleCorrectAnswer(this);
        } else {
            handleWrongAnswer(this);
        }
    });
});

// แก้ไขฟังก์ชัน handleCorrectAnswer
function handleCorrectAnswer(button) {
    score++;
    
    // สร้าง +1 นอกกรอบปุ่ม
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = '+1';
    
    // หาตำแหน่ง options ของหน้าปัจจุบัน
    const currentOptions = document.querySelector('.page.active .options');
    currentOptions.appendChild(plusOne);

    // เปลี่ยนรูปเฉพาะหน้า 3
    if(currentPage === 3) {
        const img = document.querySelector('#page3 .animal-img');
        const answer = button.textContent;
        
        // เอฟเฟค fade out
        img.style.opacity = '0';
        
        setTimeout(() => {
            // เปลี่ยนรูปตามคำตอบ
            img.src = answer === 'ไก่' ? 'kfc.jpg' : 'nugget.jpg';
            
            // เอฟเฟค fade in
            img.style.opacity = '1';
        }, 500); // ลดเวลาเหลือ 0.5 วินาที
    }

    // เปลี่ยนหน้าหลังจากแสดงผล 2 วินาที
    setTimeout(() => {
        showPage(currentPage + 1);
        updateGameContent();
    }, 2000);
}

function createConfetti() {
    const emojis = ['🎉', '🎊', '✨', '🥳', '🐔', '🍗'];
    const colors = ['#FF6B6B', '#4CAF50', '#FFD93D', '#6C5CE7'];
    
    for(let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = Math.random() * 20 + 10 + 'px';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// แก้ไขฟังก์ชัน handleWrongAnswer
function handleWrongAnswer(button) {
    button.style.animation = 'shake 0.5s'; // ลดเวลาเหลือ 0.5s
    wrongCount++;
    
    if(wrongCount === 3) {
        button.textContent = button.nextElementSibling.textContent;
        button.classList.replace('wrong', 'correct');
        wrongCount = 0;
    }
    
    setTimeout(() => button.style.animation = '', 500);
}

function updateGameContent() {
    // อัพเดตเนื้อหาเกมตามหน้า (สามารถเพิ่มรูปภาพและคำถามเพิ่มเติมได้)
    if(currentPage === 4) {
        document.getElementById('userPhoto').src = userPhoto;
    } else if(currentPage === 5) {
        document.getElementById('scoreDisplay').textContent = `${score}/3`;
        createConfetti();
    }
}
