
//too easy!
const SpeedIndicator = (props) => {
  return (
    <div className={`${!props.sessionSettings.overlay.alwaysShowSpeed && (props.speed == 1 || props.speed == 0 || props.paused)? 'invisible' : ''} absolute top-0 left-1/2 transform -translate-x-1/2 bg-stone-800 border border-2 border-sky-700 rounded-full text-2xl font-medium p-4 m-2 mt-5 pl-5 pr-5 text-white`}>
      <p>SPEED: {props.speed}x</p>
    </div>
  )
}

export default SpeedIndicator