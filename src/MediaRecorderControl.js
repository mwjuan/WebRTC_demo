import React from "react";

function MediaRecorderControl() {
    let recordedBlobs;
    let mediaStream = null;

    const startCameraOnClick = async (e) => {
        document.querySelector('button#start').disabled = true;
        const constraints = {
            audio: {
                echoCancellation: { exact: true }
            },
            video: {
                width: 1280, height: 720
            }
        };

        await init(constraints);
    }

    const init = async (constraints) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
        }
    }

    const handleSuccess = (stream) => {
        const gumVideo = document.querySelector('video#gum');
        mediaStream = stream;
        gumVideo.srcObject = stream;
    }

    const startRecord = (e) => {
        const recordButton = document.querySelector('button#record');

        if (recordButton.textContent === 'Start Recording') {
            startRecording();
        } else {
            stopRecording();
            recordButton.textContent = 'Start Recording';
        }
    }

    let mediaRecorder;
    let recordedBlobs;
    const startRecording = () => {
        recordedBlobs = [];
        const mimeType = 'video/webm;codecs=vp9,opus';
        const options = { mimeType };

        try {
            mediaRecorder = new MediaRecorder(mediaStream, options);
        } catch (e) {
            return;
        }

        const recordButton = document.querySelector('button#record');
        recordButton.textContent = 'Stop Recording';
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
    }

    const handleDataAvailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    const stopRecording = () => {
        mediaRecorder.stop();
    }

    const playMedia = (e) => {
        const recordedVideo = document.querySelector('video#recorded');

        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    }

    const download = (e) => {
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    return (
        <div id="container">
            <h1 style={{ color: 'white' }}>MediaRecorder</h1>
            <div style={{ display: 'flex', flexDirection: 'column', height: 600, width: 500 }}>
                <video id="gum" playsInline autoPlay style={{ marginBottom: 20, background: 'black' }} />
                <video id="recorded" playsInline loop style={{ marginBottom: 20, background: 'black' }} />
            </div>
            <div>
                <button style={{ background: 'red', marginRight: 5 }} id="start" onClick={e => startCameraOnClick(e)}>Start camera</button>
                <button style={{ background: 'red', marginRight: 5 }} id="record" onClick={e => startRecord(e)}>Start Recording</button>
                <button style={{ background: 'red', marginRight: 5 }} id="play" onClick={e => playMedia(e)}>Play</button>
                <button style={{ background: 'red', marginRight: 5 }} id="download" onClick={e => download(e)}>Download</button>
            </div>
        </div>
    )
}

export default MediaRecorderControl;