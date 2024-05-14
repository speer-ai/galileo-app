import { useState, useEffect } from 'react'
import { zeroPad } from '../utils/utils'

import { playButton, pauseButton, fastForwardButton, rewindButton, resetButton } from '../assets'

const UPDATES_PER_SECOND = 10

function updateDatestamp(datestamp, speed) {
  return new Date(datestamp.getTime() + speed * 1000/UPDATES_PER_SECOND)
}


const DatePanel = (props) => {
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  function handleSpeedChange(direction) {
    setPaused(false)

    if (direction === 'back')
      if (speed === 1)
        setSpeed(-1)
      else
        setSpeed(speed * 2)
    else if (direction === 'forward')
      if (speed === -1)
        setSpeed(1)
      else
        setSpeed(speed * 2)
  }

  function handleReset() {
    props.setDatestampHandler(new Date());
    setPaused(false);
    setSpeed(1.0);
  }

  //increase the datestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return
      props.setDatestampHandler(updateDatestamp(props.simulatedDatestamp, speed))
    }, 1000/UPDATES_PER_SECOND)

    return () => clearInterval(interval)
  }, [paused, props.simulatedDatestamp, speed])

  return (
    <div className='absolute flex flex-col bg-stone-800 border border-2 border-sky-700 border-1 text-bold text-white bottom-0 left-1/2 transform -translate-x-1/2 p-4 m-2'>
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 text-lg font-bold rounded mx-auto'>{props.simulatedDatestamp.getUTCFullYear()}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>yr</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-lg rounded mx-auto'>{zeroPad(props.simulatedDatestamp.getUTCMonth())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>mt</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-lg rounded mx-auto'>{zeroPad(props.simulatedDatestamp.getUTCDate())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>dy</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-lg rounded mx-auto'>{zeroPad(props.simulatedDatestamp.getUTCHours())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>hr</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-lg rounded mx-auto'>{zeroPad(props.simulatedDatestamp.getUTCMinutes())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>min</p>
        </div>
        <div className='flex flex-col'>
          <span className='bg-stone-700 p-2 font-bold text-lg rounded mx-auto'>{zeroPad(props.simulatedDatestamp.getUTCSeconds())}</span>
          <p className='text-stone-500 text-xs mx-auto pt-2'>sec</p>
        </div>
      </div>
      <div className='flex flex-row justify-center'>
        <button
          className='border p-2 m-2'
          onClick={() => handleSpeedChange('back')}><img className='max-w-6' src={rewindButton} alt='rewind'/>
        </button>
        <button
          className={`border p-${paused ? '3' : '2'} m-2`}
          onClick={() => setPaused(!paused)}><img className={`max-w-${paused ? '4' : '6'}`} src={paused ? playButton : pauseButton} alt='play/pause'/>
        </button>
        <button
          className='border p-2 m-2'
          onClick={handleReset}><img className='max-w-6' src={resetButton} alt='reset'/>
        </button>
        <button
          className='border p-2 m-2'
          onClick={() => handleSpeedChange('forward')}><img className='max-w-6' src={fastForwardButton} alt='fast forward'/>
        </button>
      </div>
    </div>
  )
}

export default DatePanel