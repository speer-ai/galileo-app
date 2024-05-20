import { useState } from 'react'
import { settingsBtn } from '../assets'
import { chevronRight } from '../assets'

const SettingsPanel = (props) => {
  function toggleHandler() {
    props.openPanelHandler(props.openPanel === 'settings' ? 'about' : 'settings')
  }

  return (
    <>
    {props.openPanel === 'settings' &&
    <div className='absolute right-0 h-full flex flex-row slideIn animation-slideIn'>
      <button
          className='p-2 mt-5 m-2 w-12 h-12'
          onClick={toggleHandler}><img className='m-auto h-full' src={props.openPanel == 'settings' ? chevronRight : settingsBtn} alt='rewind'/>
        </button> 
      
      <div className='opacity opacity-60 bg-stone-700 min-w-96'>
          <h1 className='galileoFont text-6xl text-white p-4 text-center'>SETTINGS</h1>
      </div>

    </div>}
    </>
  )
}

export default SettingsPanel