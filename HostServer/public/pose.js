const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


async function onResults(results) {
    if (!results.poseLandmarks) {
        return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.segmentationMask, 0, 0,
            canvasElement.width, canvasElement.height);
    canvasCtx.fillStyle = '#000000';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#00FF00', lineWidth: 1});
    drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#FF0000', radius: 1});

    const unit8Arr = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
    // const rgba = Array.from(unit8Arr);
    // const rgb = [];
    // var row = [];

    // var count = 0;
    // while(rgba.length) {
    //     row.push(rgba.splice(0, 3))
    //     rgba.shift();  // remove first element
    //     count++;
    //     if(count == 224){
    //         rgb.push(row);
    //         row = [];
    //         count = 0;
    //     }
    // }
    // console.log(rgb);

    // var imgStr = canvasElement.toDataURL("image/jpeg").split(';base64,')[1];
    // console.log(imgStr);
    socket.emit('canvas_img', unit8Arr);
}

const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 100,
    height: 100
});
camera.start();