import DatePanel from './components/DatePanel'
import SelectedObjectInfoBox from './components/SelectedObjectInfoBox'
import ThreeCanvas from './components/ThreeCanvas'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import provideExample from './utils/utils'

const NONE_SELECTED = -1

const App = () => {
  const [objects, setObjects] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(NONE_SELECTED)
  const [simulatedDatestamp, setSimulatedDatestamp] = useState(new Date())

  //gather initially
  useEffect(() => {
    setObjects([provideExample()]);
  }, []);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      console.log(selectedIdx)
      setSelectedIdx(NONE_SELECTED);
    }
  });

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
    </div>
  )
}

export default App
