import DatePanel from './components/DatePanel'
import SelectedObjectInfoBox from './components/SelectedObjectInfoBox'
import ThreeCanvas from './components/ThreeCanvas'
import FPSMeter from './utils/fpsMeter'
import SettingsPanel from './components/SettingsPanel'
import AboutPanel from './components/AboutPanel'
import SpeedIndicator from './components/SpeedIndicator'
import SearchBar from './components/SearchBar'

import { settingsBtn } from './assets'
import { aboutBtn } from './assets'
import Load from './components/Load'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'

import load_data from './services/tle_fetch'
import load_settings from './settings/settings'

import { NONE_SELECTED } from './constants'

const App = () => {
  //state
  const [objects, setObjects] = useState()
  const [sessionSettings, setSessionSettings] = useState(null)

  const [selectedIdx, setSelectedIdx] = useState(NONE_SELECTED)
  const [openPanel, setOpenPanel] = useState('none')

  const [simulatedDatestamp, setSimulatedDatestamp] = useState(null)
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)

  //fill defualts when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await load_data()
      console.log('dataHere', data.entries)
      setObjects(data.entries)
    }

    fetchData()
    setSimulatedDatestamp(new Date());
    setSessionSettings(load_settings());
  }, [])


  //keyboard event listener
  const keyboardEventListener = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (selectedIdx < objects.length - 1)
          setSelectedIdx(selectedIdx + 1)
        break
      case 'ArrowDown':
        if (selectedIdx > 0)
          setSelectedIdx(selectedIdx - 1)
        break
      case 'Escape':
        setSelectedIdx(NONE_SELECTED)
        break
      case ' ':
        setPaused(!paused)
        break
      case 'i':
        setOpenPanel(openPanel === 'about' ? 'none' : 'about')
        break
      case 's':
        setOpenPanel(openPanel === 'settings' ? 'none' : 'settings')
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
      <Suspense fallback={<Load />}>
        {objects && sessionSettings && simulatedDatestamp &&
        <ThreeCanvas
          objects={objects}
          simulatedDatestamp={simulatedDatestamp}
          selectedIdx={selectedIdx}
          setSelectedHandler={setSelectedIdx}
          sessionSettings={sessionSettings}/>}
      </Suspense>

      {objects &&
      <div className='absolute left-0 top-0 m-2'>
        <SearchBar objects={objects} setSelectedIdx={setSelectedIdx} />
      </div>}

      {simulatedDatestamp && sessionSettings &&
      <DatePanel
        simulatedDatestamp={simulatedDatestamp}
        setSimulatedDatestamp={setSimulatedDatestamp}
        speed={speed}
        setSpeed={setSpeed}
        paused={paused}
        setPaused={setPaused}
        sessionSettings={sessionSettings}
        />}

      {sessionSettings &&
      <SpeedIndicator
        speed={speed}
        paused={paused}
        sessionSettings={sessionSettings}
      />}

      {selectedIdx !== NONE_SELECTED &&
        <SelectedObjectInfoBox
          setSelectedIdx={setSelectedIdx}
          object={objects[selectedIdx]}
          simulatedDatestamp={simulatedDatestamp}
          sessionSettings={sessionSettings}
        />}
        
      <button className={`${openPanel !== 'none' ? 'hidden' : 'block'} border border-2 border-sky-700 m-2 p-2 absolute right-0 top-0 w-12 bg-stone-800 h-12`}>
        <img
          className='cursor-pointer transform rotate-0 hover:rotate-45 transition-transform duration-300 ease-in-out'
          src={settingsBtn}
          alt='settings'
          onClick={() => setOpenPanel('settings')}/>
      </button>
      <button className={`${openPanel !== 'none' ? 'hidden' : 'block'} border border-2 border-sky-700 m-2 p-2 mr-16 absolute right-0 top-0 w-12 bg-stone-800 h-12`}>
        <img
          className='cursor-pointer transform scale-100 hover:scale-110 transition-transform duration-300 ease-in-out'
          src={aboutBtn}
          alt='settings'
          onClick={() => setOpenPanel('about')}/>
      </button>


      <SettingsPanel
        openPanel={openPanel}
        openPanelHandler={setOpenPanel}
        sessionSettings={sessionSettings}
        setSessionSettings={setSessionSettings}/>
      <AboutPanel
        openPanel={openPanel}
        openPanelHandler={setOpenPanel}/>

      {sessionSettings && sessionSettings.overlay.showFPSGraph &&
      <div className='absolute left-0 top-0'>
        <FPSMeter />
      </div>}
    </div>
  )
}

export default App
