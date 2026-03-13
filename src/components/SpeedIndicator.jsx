const SpeedIndicator = (props) => {
  const hidden = !props.sessionSettings.overlay.alwaysShowSpeed &&
    (props.speed === 1 || props.speed === 0 || props.paused)

  if (hidden) return null

  return (
    <div className="speed-indicator">
      <span className="speed-value">{props.speed}x</span>
    </div>
  )
}

export default SpeedIndicator
