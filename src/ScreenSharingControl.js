import React from 'react';

function ScreenSharingControl() {
    let mediaStream = null;

    const start = async (e) => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            mediaStream = stream;
            handleSuccess(stream);
        } catch (e) {
        }
    }

    const handleSuccess = (stream) => {
        const video = document.querySelector('video');
        video.srcObject = stream;
    }

    return (
        <div id="container" style={{ display: 'flex', flexDirection: 'column', height: 800, width: 500 }}>
            <p>Display the screensharing stream from <code>getDisplayMedia()</code> in a video element.</p>
            <video id="gum-local" autoPlay playsInline muted style={{ background: 'black', margin: 20 }} />
            <button id="startButton" style={{ background: 'red' }} onClick={e => start(e)}>Start</button>
        </div>
    )
}

export default ScreenSharingControl;