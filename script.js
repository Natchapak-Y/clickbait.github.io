let currentPage = 1;
let wrongCount = 0;
let score = 0;
let cameraAttempts = 0;
let userPhoto = null;

const pages = document.querySelectorAll('.page');
const message = document.getElementById('message');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

document.getElementById('startBtn').addEventListener('click', initCamera);

function showPage(pageNumber) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;
}

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        takePhoto();
        showPage(2);
    } catch (err) {
        handleCameraError();
    }
}

function takePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    userPhoto = canvas.toDataURL('image/png');
}

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
            window.close() || (window.location.href = 'about:blank');
        }, 1000);
        return;
    }

    setTimeout(() => initCamera(), cameraAttempts === 3 ? 1000 : 3000);
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
    plusOne.style.animation = 'float 2s';
    button.appendChild(plusOne);

    setTimeout(() => {
        if(currentPage === 4) showPage(5);
        else showPage(currentPage + 1);
        updateGameContent();
    }, 2000);
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

function createConfetti() {
    for(let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        document.body.appendChild(confetti);
    }
}
