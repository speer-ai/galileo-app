import DatePanel from './components/DatePanel'
import SelectedObjectInfoBox from './components/SelectedObjectInfoBox'
import ThreeCanvas from './components/ThreeCanvas'
import FPSMeter from './utils/fpsMeter'
import SettingsPanel from './components/SettingsPanel'
import AboutPanel from './components/AboutPanel'

import { settingsBtn } from './assets'
import { aboutBtn } from './assets'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'

import load_data from './services/tle_fetch'
import load_settings from './settings/settings'

const NONE_SELECTED = -1

const App = () => {
  //state
  const [objects, setObjects] = useState(load_data().entries)
  const [sessionSettings, setSessionSettings] = useState(load_settings())

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

  //when settings change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(sessionSettings));
  }, [sessionSettings])


  //add keyboard shortcuts
  useEffect(() => {
    document.body.addEventListener('keydown', keyboardEventListener);
    return () => {
      document.body.removeEventListener('keydown', keyboardEventListener);
    }
  });

  //building the application here
  return (
    <div className='w-full h-screen flex'>
      <ThreeCanvas
        objects={objects}
        simulatedDatestamp={simulatedDatestamp}
        selectedIdx={selectedIdx}
        setSelectedHandler={setSelectedIdx}
        sessionSettings={sessionSettings}/>

      <DatePanel
        simulatedDatestamp={simulatedDatestamp}
        setDatestampHandler={setSimulatedDatestamp}
        sessionSettings={sessionSettings}
        />

      {selectedIdx !== NONE_SELECTED &&
        

        <SelectedObjectInfoBox
          object={objects[selectedIdx]}
          simulatedDatestamp={simulatedDatestamp} />}
        
      <buttton className={`${openPanel !== 'none' ? 'hidden' : 'block'} border border-2 border-sky-700 m-2 p-2 absolute right-0 top-0 w-12 bg-stone-800 h-12`}>
        <img
          className='cursor-pointer transform rotate-0 hover:rotate-45 transition-transform duration-300 ease-in-out'
          src={settingsBtn}
          alt='settings'
          onClick={() => setOpenPanel('settings')}/>
      </buttton>
      <buttton className={`${openPanel !== 'none' ? 'hidden' : 'block'} border border-2 border-sky-700 m-2 p-2 mr-16 absolute right-0 top-0 w-12 bg-stone-800 h-12`}>
        <img
          className='cursor-pointer transform scale-100 hover:scale-110 transition-transform duration-300 ease-in-out'
          src={aboutBtn}
          alt='settings'
          onClick={() => setOpenPanel('about')}/>
      </buttton>


      <SettingsPanel
        openPanel={openPanel}
        openPanelHandler={setOpenPanel}
        sessionSettings={sessionSettings}
        setSessionSettings={setSessionSettings}/>
      <AboutPanel
        openPanel={openPanel}
        openPanelHandler={setOpenPanel}/>

      {sessionSettings.overlay.showFPSGraph &&
      <div className='absolute l-0'>
        <FPSMeter />
      </div>}
    </div>
  )
}

export default App
