import { useEffect } from 'react'
import { zeroPad } from '../utils/utils'

function updateDatestamp(datestamp, speed) {
  return new Date(datestamp.getTime() + speed * 2)
}

const DatePanel = (props) => {
  const keyboardEventListener = (e) => {
    if (e.target.tagName === 'INPUT') return
    switch (e.key) {
      case 'ArrowRight':
        handleSpeedChange('forward')
        break
      case 'ArrowLeft':
        handleSpeedChange('back')
        break
      case 'r':
        handleReset()
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', keyboardEventListener)
    return () => document.body.removeEventListener('keydown', keyboardEventListener)
  })

  function handleSpeedChange(direction) {
    if (direction === 'back')
      if (props.paused)
        props.setSpeed(-1)
      else if (props.speed <= 2 && props.speed > -2)
        props.setSpeed(s => s - 1)
      else
        props.setSpeed(props.speed * (props.speed < 0 ? 2 : 0.5))
    else if (direction === 'forward')
      if (props.paused)
        props.setSpeed(1)
      else if (props.speed < 2 && props.speed >= -2)
        props.setSpeed(s => s + 1)
      else
        props.setSpeed(props.speed * (props.speed < 0 ? 0.5 : 2))

    props.setPaused(false)
  }

  function handleReset() {
    props.setSimulatedDatestamp(new Date())
    props.setPaused(false)
    props.setSpeed(1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.paused) return
      props.setSimulatedDatestamp(updateDatestamp(props.simulatedDatestamp, props.speed))
    })
    return () => clearInterval(interval)
  }, [props])

  const d = props.simulatedDatestamp
  const timeSegments = [
    { value: d.getUTCFullYear(), label: 'YR', wide: true },
    { value: zeroPad(d.getUTCMonth() + 1), label: 'MO' },
    { value: zeroPad(d.getUTCDate()), label: 'DY' },
    { value: zeroPad(d.getUTCHours()), label: 'HR' },
    { value: zeroPad(d.getUTCMinutes()), label: 'MI' },
    { value: zeroPad(d.getUTCSeconds()), label: 'SC' },
  ]

  return (
    <div className="time-panel">
      <div className="time-display">
        {timeSegments.map((seg, i) => (
          <div key={i} className="time-segment">
            <span className={`time-value ${seg.wide ? 'wide' : ''}`}>{seg.value}</span>
            <span className="time-label">{seg.label}</span>
          </div>
        ))}
        <div className="time-utc-badge">UTC</div>
      </div>
      <div className="time-controls">
        <button className="time-btn" onClick={() => handleSpeedChange('back')} title="Rewind">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
        </button>
        <button className="time-btn play" onClick={() => props.setPaused(!props.paused)} title={props.paused ? 'Play' : 'Pause'}>
          {props.paused ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          )}
        </button>
        <button className="time-btn" onClick={handleReset} title="Reset to now">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        </button>
        <button className="time-btn" onClick={() => handleSpeedChange('forward')} title="Fast forward">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 18V6l8.5 6L13 18zM2 18V6l8.5 6L2 18z"/></svg>
        </button>
      </div>
    </div>
  )
}

export default DatePanel
