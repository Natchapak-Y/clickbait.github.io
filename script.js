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

// แทนที่ Event Listener เดิมด้วยโค้ดนี้
document.getElementById('startBtn').addEventListener('click', function() {
    this.disabled = true;
    initCamera();
    setTimeout(() => this.disabled = false, 3000);
});

function showPage(pageNumber) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;
}

// แทนที่ฟังก์ชัน initCamera ทั้งหมดด้วยโค้ดนี้
async function initCamera() {
    if (isRequesting) return;
    isRequesting = true;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        takePhoto();
        showPage(2);
        cameraAttempts = 0;
    } catch (err) {
        handleCameraError();
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

// แทนที่ฟังก์ชัน handleCameraError ทั้งหมดด้วยโค้ดนี้
function handleCameraError() {
    cameraAttempts++;
    
    const messages = [
        'หากไม่อนุญาตจะไม่สามารถเล่นเกมนี้ได้',
        'โปรดกดอนุญาตเพื่อเล่นเกม',
        'งั้นก็ไม่ต้องเล่น'
    ];

    showMessage(messages[cameraAttempts-1], cameraAttempts === 3 ? 1000 : 3000);
    
    if(cameraAttempts === 3) {
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 1000);
        return;
    }

    setTimeout(() => {
        initCamera();
    }, cameraAttempts === 3 ? 1000 : 3000);
}

function showMessage(text, duration) {
    message.textContent = text;
    message.style.display = 'block';
    setTimeout(() => message.style.display = 'none', duration);
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

function handleCorrectAnswer(button) {
    score++;
    const plusOne = document.createElement('div');
    plusOne.textContent = '+1';
    plusOne.style.position = 'absolute';
    plusOne.style.top = '-20px';
    plusOne.style.right = '-20px';
    plusOne.style.transform = 'rotate(30deg)';
    plusOne.style.color = '#4CAF50';
    plusOne.style.fontSize = '2em';
    plusOne.style.fontWeight = 'bold';
    plusOne.style.animation = 'float 2s forwards';
    button.appendChild(plusOne);

    // เปลี่ยนรูป KFC เมื่อตอบถูกในหน้า 3
    if(currentPage === 3) {
        const img = document.querySelector('#page3 .animal-img');
        const answer = button.textContent;
        img.style.transition = 'opacity 1s';
        img.style.opacity = '0';
        
        setTimeout(() => {
            img.src = answer === 'ไก่' ? 'kfc.jpg' : 'nugget.jpg';
            img.style.opacity = '1';
        }, 1000);
    }

    setTimeout(() => {
        if(currentPage === 4) showPage(5);
        else showPage(currentPage + 1);
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

function handleWrongAnswer(button) {
    button.style.animation = 'shake 0.75s';
    wrongCount++;
    
    if(wrongCount === 3) {
        button.textContent = button.nextElementSibling.textContent;
        button.classList.replace('wrong', 'correct');
        wrongCount = 0;
    }
    
    setTimeout(() => button.style.animation = '', 750);
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
