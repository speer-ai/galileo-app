import DatePanel from './components/DatePanel'
import SelectedObjectInfoBox from './components/SelectedObjectInfoBox'
import ThreeCanvas from './components/ThreeCanvas'
import FPSMeter from './utils/fpsMeter'
import SettingsPanel from './components/SettingsPanel'

import { settingsBtn } from './assets'
import { aboutBtn } from './assets'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import load_data from './services/tle_fetch'

const NONE_SELECTED = -1

const App = () => {
  //state
  const [objects, setObjects] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(NONE_SELECTED)
  const [simulatedDatestamp, setSimulatedDatestamp] = useState(new Date())
  const [openPanel, setOpenPanel] = useState('none')

  //keyboard event listener
  const keyboardEventListener = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        setSelectedIdx(selectedIdx + 1)
        break
      case 'ArrowDown':
        setSelectedIdx(selectedIdx - 1)
        break
      case 'Escape':
        setSelectedIdx(NONE_SELECTED)
        break
      default:
        break
    }
  }

  //gather initially
  useEffect(() => {
    setObjects(load_data().entries);

    //added only once
    document.body.addEventListener('keydown', keyboardEventListener);

    //remove after 'done'
    return () => {
      document.body.removeEventListener('keydown', keyboardEventListener);
    }
  }, [selectedIdx]);

  //building the application here
  return (
    <div className='w-full h-screen flex'>
      <ThreeCanvas
        objects={objects}
        simulatedDatestamp={simulatedDatestamp}
        selectedState={selectedIdx}
        setSelectedHandler={setSelectedIdx}/>

      <DatePanel
        simulatedDatestamp={simulatedDatestamp}
        setDatestampHandler={setSimulatedDatestamp}
        />

      {selectedIdx !== NONE_SELECTED &&
        <SelectedObjectInfoBox
          object={objects[selectedIdx]}
          simulatedDatestamp={simulatedDatestamp} />}
        
      <buttton className='border border-2 border-sky-700 m-2 p-2 absolute right-0 top-0 w-16 bg-stone-800 h-16'>
        <img
          className='cursor-pointer transform rotate-0 hover:rotate-45 transition-transform duration-300 ease-in-out'
          src={settingsBtn}
          alt='settings'
          onClick={() => setOpenPanel('settings')}/>
      </buttton>
      <buttton className='border border-2 border-sky-700 m-2 p-2 mr-20 absolute right-0 top-0 w-16 bg-stone-800 h-16'>
        <img
          className='cursor-pointer transform scale-100 hover:scale-110 transition-transform duration-300 ease-in-out'
          src={aboutBtn}
          alt='settings'
          onClick={() => setOpenPanel('settings')}/>
      </buttton>


      <SettingsPanel
        openPanel={openPanel}
        openPanelHandler={setOpenPanel}/>

      <div className='absolute l-0'>
        <FPSMeter />
      </div>
    </div>
  )
}

export default App
