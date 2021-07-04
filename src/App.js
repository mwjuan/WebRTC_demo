import './App.css';
import { Row, Col, Select, Button, Tabs } from 'antd';
import MediaRecorderControl from './MediaRecorderControl';
import ScreenSharingControl from './ScreenSharingControl';
const { TabPane } = Tabs;
const { Option } = Select;

function App() {
  let localMediaStream = null;

  const init = async (e) => {
    try {
      let constraints = { audio: false, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      let video = document.querySelector('video');
      localMediaStream = stream;
      video.srcObject = stream;
      e.target.disabled = true;
    } catch (error) {
      console.log(error)
    }
  }

  const calculateSize = (srcSize, dstSize) => {
    var srcRatio = srcSize.width / srcSize.height;
    var dstRatio = dstSize.width / dstSize.height;
    if (dstRatio > srcRatio) {
      return {
        width: dstSize.height * srcRatio,
        height: dstSize.height
      };
    } else {
      return {
        width: dstSize.width,
        height: dstSize.width / srcRatio
      };
    }
  }

  const capture = (e) => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    if (localMediaStream) {
      let video = document.querySelector('video');
      var videoSize = { width: video.videoWidth, height: video.videoHeight };
      var canvasSize = { width: canvas.width, height: canvas.height };
      var renderSize = calculateSize(videoSize, canvasSize);
      var xOffset = (canvasSize.width - renderSize.width) / 2;
      ctx.drawImage(video, xOffset, 0, renderSize.width, renderSize.height);

      document.querySelector('img').src = canvas.toDataURL('image/webp');
    }
  }

  const handleChange = (e) => {
    let color = e;
    let canvas = document.querySelector('canvas');
    let video = document.querySelector('video');
    canvas.className = color;
    video.className = color;
  }

  return (
    <Tabs defaultActiveKey={'3'} className='App-header'>
      <TabPane tab="getMedia" key="1">
        <div className="App-header">
          <Row gutter={24} style={{ marginBottom: 10 }}>
            <Col span={12}>
              <div style={{ display: 'flex', flexDirection: "row", marginTop: 10 }}>
                css filter
                <Select id="filter" style={{ marginLeft: 10, width: 90 }} onChange={e => handleChange(e)}>
                  <Option value="none">None</Option>
                  <Option value="blur">Blur</Option>
                  <Option value="grayscale">Grayscale</Option>
                  <Option value="invert">Invert</Option>
                  <Option value="sepia">Sepia</Option>
                </Select>
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <video id="video" autoPlay playsInline style={{ marginBottom: 20, background: 'black' }} />
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <canvas id='canvas' style={{ marginBottom: 20, border: '1px solid #eeeeee' }}>
                <img id='img' style={{ width: '100%' }} />
              </canvas>
            </Col>

          </Row>
          <Row>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button id="showVideo" style={{ width: 200 }} onClick={e => init(e)}>Open camera</Button>
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button id="showVideo" style={{ width: 200, marginLeft: 20 }} onClick={e => capture(e)}>capture</Button>
            </Col>
          </Row>
        </div>
      </TabPane>
      <TabPane tab='MediaRecorder' key='2'>
        <MediaRecorderControl />
      </TabPane>
      <TabPane tab='Screen Sharing' key='3'>
        <ScreenSharingControl />
      </TabPane>
    </Tabs>
  );
}

export default App;
