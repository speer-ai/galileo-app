import React from "react";

const RUNNING_FRAME_COUNT = 300;
const lastNSeconds = (frames, n) => {
  const now = performance.now();
  return frames.filter(frame => now - frame.time < n * 1000);
};
const frameLengthAverage = frameLengths =>
  frameLengths.length > 0
    ? frameLengths.reduce((sum, time) => sum + time, 0) / frameLengths.length
    : 0;
const frameLengthToFPS = length => (length > 0 ? round(1000 / length) : 60);
const round = value => Math.round(100 * value) / 100;

const FPSAverage = ({ frames }) => {
  const last3SecondsFrameLengths = lastNSeconds(frames, 3);
  return (
    <div>
      {frameLengthToFPS(frameLengthAverage(last3SecondsFrameLengths))} fps
    </div>
  );
};

const GRAPH_SIZE = {
  height: 100,
  width: 200
};
const FPSGraph = ({ frames }) => (
  <div
    style={{
      height: GRAPH_SIZE.height,
      width: GRAPH_SIZE.width,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end"
    }}
  >
    {lastNSeconds(frames, 1)
      .map(frame => ({ fps: frameLengthToFPS(frame.length), frame }))
      .map(({ fps, frame }, i) => (
        <div
          key={`frame-${i}`}
          style={{
            width: (GRAPH_SIZE.width * frame.length) / 1000,
            backgroundColor: "green",
            height: GRAPH_SIZE.height * Math.max(Math.min(fps / 60, 1), 0)
          }}
        />
      ))}
  </div>
);

class FPSMeter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { frames: [] };
    this.frameId = undefined;
    this.startTime = 0;
    this.previousFrameTime = 0;
  }

  componentDidMount() {
    this.startTime = performance.now();
    this.previousFrameTime = this.startTime;
    this.setState({ frames: [{ length: 0, time: this.startTime }] });
    this.startLoop();
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  render() {
    return (
      <div className="opacity opacity-50"
        style={{
          padding: "10px 20px",
          borderRadius: 5,
          fontSize: 20,
          backgroundColor: "black",
          color: "green",
          fontFamily: "Courier New",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div>
          <FPSAverage frames={this.state.frames} />
          <div style={{ height: 5 }} />
          <FPSGraph frames={this.state.frames} />
        </div>
      </div>
    );
  }

  loop = frameTime => {
    this.frameId = undefined;
    this.scheduleFrame();
    const frameLength = frameTime - this.previousFrameTime;
    this.previousFrameTime = frameTime;
    if (frameLength > 1000) {
      return;
    }
    this.setState({
      frames: [
        ...this.state.frames.slice(-RUNNING_FRAME_COUNT),
        { length: frameLength, time: frameTime }
      ]
    });
  };

  scheduleFrame = () => {
    this.cancelFrame();
    this.frameId = window.requestAnimationFrame(this.loop);
  };

  cancelFrame = () => {
    if (this.frameId !== undefined) {
      window.cancelAnimationFrame(this.frameId);
    }
  };

  startLoop = () => {
    this.frameId = window.requestAnimationFrame(this.loop);
  };
  stopLoop = () => {
    this.cancelFrame();
  };
}

export default FPSMeter;