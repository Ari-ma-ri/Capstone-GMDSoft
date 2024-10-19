document.getElementById('filterBtn').addEventListener('click', function () {
    document.getElementById('filterPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('filterPopup').style.display = 'none';
});

document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('filterPopup').style.display = 'none';

    const selectedModel = document.querySelector('input[name="model"]:checked').value;

    fetch('/select_model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: selectedModel })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log(`Model switched to: ${data.selected_model}`);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(err => console.error('Error:', err));
});

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            const video = document.getElementById('video');
            video.srcObject = stream;

            video.addEventListener('loadeddata', () => {
                detectFrame(video);
            });
        })
        .catch(err => console.error("Error accessing webcam: " + err));
}

function drawDetections(detections, context, video) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    detections.forEach(detection => {
        const { label, confidence, box } = detection;
        const scaleX = context.canvas.width / video.videoWidth;
        const scaleY = context.canvas.height / video.videoHeight;
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(box[0] * scaleX, box[1] * scaleY, (box[2] - box[0]) * scaleX, (box[3] - box[1]) * scaleY);
        context.fillStyle = 'red';
        context.fillText(`${label} (${(confidence * 100).toFixed(2)}%)`, box[0] * scaleX, box[1] * scaleY > 10 ? box[1] * scaleY - 5 : 10);
    });
}

function detectFrame(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        fetch('/detect', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(detections => {
                const overlay = document.getElementById('overlay');
                const overlayContext = overlay.getContext('2d');
                drawDetections(detections, overlayContext, video);
                requestAnimationFrame(() => detectFrame(video));
            })
            .catch(err => console.error(err));
    }, 'image/jpeg');
}

function addNotification(detection) {
    const notificationList = document.getElementById('notification-list');
    const notificationItem = document.createElement('p');

    // Get the current time
    const currentTime = detection.time;

    // Format the notification
    notificationItem.textContent = `${detection.label}, ${currentTime}`;
    notificationList.appendChild(notificationItem);
}

document.getElementById('downloadBtn').addEventListener('click', function () {
    const notificationList = document.getElementById('notification-list');
    const notifications = Array.from(notificationList.children).map(item => item.textContent);
    const blob = new Blob([notifications.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notifications.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// Connect to the Socket.IO server
const socket = io();

// Listen for 'new_detection' events
socket.on('new_detection', function (detection) {
    addNotification(detection);
});

startVideo();
