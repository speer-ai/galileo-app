import { chevronRight } from '../assets'
import { capitalizeFirstLetter } from '../utils/utils'

function getBrowserLocation(cb) {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      cb({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
    },
    () => alert('Unable to retrieve your location')
  )
}

const SettingsPanel = (props) => {

  function handleUseBrowserLocation() {
    getBrowserLocation(({ latitude, longitude }) => {
      const newSettings = { ...props.sessionSettings }
      newSettings.general.latitude = latitude
      newSettings.general.longitude = longitude
      props.setSessionSettings(newSettings)
    })
  }

  return (
    <>
    {props.openPanel === 'settings' &&
    <div className='absolute right-0 h-full flex flex-row'>
      <button
        className='p-2 mt-5 m-2 w-12 h-12 cursor-pointer transform hover:translate-x-2 transition-transform duration-300 ease-in-out'
        onClick={() => props.openPanelHandler('none')}><img className='m-auto h-full' src={chevronRight} alt='rewind'/>
      </button> 
      
      <div className='bg-opacity-60 bg-stone-700 min-w-96 overflow-scroll overflow-x-hidden'>
        <h1 className='galileoFont text-6xl text-white p-4 text-center'>SETTINGS</h1>
        
        
        {Object.keys(props.sessionSettings).map((category, idx) => {
          //map through keys in settings by category (double map)
          return (
            <div
              className='bg-stone-900 bg-opacity-80 rounded m-2'>
              <h2
                key={idx}
                className='text-white text-2xl p-2 text-sky-400 font-medium'>{capitalizeFirstLetter(category)}
              </h2>
              {Object.keys(props.sessionSettings[category]).map((setting, subidx) => {
                return (
                  <div
                    className='flex flex-row p-2 justify-between'>
                    <label htmlFor={setting} className='text-white cursor-pointer mr-3 my-auto text-sm'>{setting}</label>
                    {typeof props.sessionSettings[category][setting] === 'boolean' &&
                    <input
                      id={setting}
                      type='checkbox'
                      checked={props.sessionSettings[category][setting]}
                      onChange={(e) => {
                        let newSettings = {...props.sessionSettings};
                        newSettings[category][setting] = e.target.checked;
                        props.setSessionSettings(newSettings);
                      }}
                      className='bg-stone-800 text-white cursor-pointer'/>}
                    {typeof props.sessionSettings[category][setting] === 'number' &&
                    <input
                      id={setting}
                      type='number'
                      value={props.sessionSettings[category][setting]}
                      onChange={(e) => {
                        let newSettings = {...props.sessionSettings};
                        newSettings[category][setting] = parseFloat(e.target.value);
                        props.setSessionSettings(newSettings);
                      }}
                      className='bg-stone-800 text-white cursor-text text-center p-1 rounded text-sm'/>}
                  </div>
                )
              })}
              {category === 'general' &&
                <button
                  className='bg-stone-800 text-white p-2 m-2 rounded text-sm hover:bg-stone-600'
                  onClick={handleUseBrowserLocation}>
                  Use Browser Location
                </button>}
            </div>
          )
        })}
      </div>
    </div>}
    </>
  )
}

export default SettingsPanel