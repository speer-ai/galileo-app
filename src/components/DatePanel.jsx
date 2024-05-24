import { useEffect } from 'react'
import { zeroPad } from '../utils/utils'

import { playButton, pauseButton, fastForwardButton, rewindButton, resetButton } from '../assets'

function updateDatestamp(datestamp, speed, ups) {
  return new Date(datestamp.getTime() + speed * 15000/ups)
}


const DatePanel = (props) => {
   //keyboard event listener
   const keyboardEventListener = (e) => {
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

  //add keyboard shortcuts
  useEffect(() => {
    document.body.addEventListener('keydown', keyboardEventListener);
    return () => {
      document.body.removeEventListener('keydown', keyboardEventListener);
    }
  });

  //-16 -8 -4 -2 -1 0 1 2 4 8 16
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
    props.setSimulatedDatestamp(new Date());
    props.setPaused(false);
    props.setSpeed(1);
  }

  //increase the datestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (props.paused) return
      props.setSimulatedDatestamp(updateDatestamp(props.simulatedDatestamp, props.speed, props.sessionSettings.renderer.updatesPerSecond))
    }, 1/props.sessionSettings.renderer.updatesPerSecond)

    return () => clearInterval(interval)
  }, [props])

  return (
    <div className='absolute flex flex-col bg-stone-800 border border-2 border-sky-700 border-1 text-bold text-white bottom-0 left-1/2 transform -translate-x-1/2 p-4 m-2 min-w-96'>
      <div className='flex flex-row justify-center gap-4'>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 text-md font-bold rounded mx-auto w-18 text-center'>{props.simulatedDatestamp.getUTCFullYear()}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>yr</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-md rounded mx-auto w-10 text-center'>{zeroPad(props.simulatedDatestamp.getUTCMonth()+1)}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>mt</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-md rounded mx-auto w-10 text-center'>{zeroPad(props.simulatedDatestamp.getUTCDate())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>dy</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-md rounded mx-auto w-10 text-center'>{zeroPad(props.simulatedDatestamp.getUTCHours())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>hr</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-md rounded mx-auto w-10 text-center'>{zeroPad(props.simulatedDatestamp.getUTCMinutes())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>min</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-md rounded mx-auto w-10 text-center'>{zeroPad(props.simulatedDatestamp.getUTCSeconds())}</span>
          <p className='text-stone-500 text-xs text-center pt-2'>sec</p>
        </div>
      </div>
      <div className='flex flex-row justify-center'>
        <button
          className='border p-2 m-2 w-10'
          onClick={() => handleSpeedChange('back')}><img className='m-auto transform scale-90 hover:scale-110 transition-transform' src={rewindButton} alt='rewind'/>
        </button>
        <button
          className='border p-2 m-2 w-10'
          onClick={() => props.setPaused(!props.paused)}><img className='m-auto transform scale-90 hover:scale-110 transition-transform' src={props.paused ? playButton : pauseButton} alt='play/pause'/>
        </button>
        <button
          className='border p-2 m-2 w-10'
          onClick={handleReset}><img className='m-auto transform scale-90 hover:scale-110 transition-transform' src={resetButton} alt='reset'/>
        </button>
        <button
          className='border p-2 m-2 w-10'
          onClick={() => handleSpeedChange('forward')}><img className='m-auto transform scale-90 hover:scale-110 transition-transform' src={fastForwardButton} alt='fast forward'/>
        </button>
      </div>
    </div>
  )
}

export default DatePanel