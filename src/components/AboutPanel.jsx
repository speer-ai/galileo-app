import { chevronRight } from '../assets'
import { galileoBanner } from '../assets'

const Hotkey = ({hotkey, info}) => {
  return (
    <>
      <div className='pl-6 m-2 '>
        <span className='text-white bg-stone-200 text-sm text-stone-900 font-bold p-2 rounded-full'>{hotkey}</span>
      </div>
      <p className='text-white my-auto text-sky-400 text-sm font-semibold'>{info}</p>
    </>
  )
}

const AboutPanel = (props) => {

  return (
    <>
    {props.openPanel === 'about' &&
    <div className='absolute right-0 h-full flex flex-row slideIn animation-slideIn'>
      <button
          className='p-2 mt-5 m-2 w-12 h-12 cursor-pointer transform hover:translate-x-2 transition-transform duration-300 ease-in-out'
          onClick={() => props.openPanelHandler('none')}><img className='m-auto h-full' src={chevronRight} alt='rewind'/>
      </button> 
      
      <div className='bg-opacity-60 bg-stone-700 min-w-96 overflow-scroll overflow-x-hidden'>
          <img
            src={galileoBanner}
            alt='Galileo Logo'
            className='max-w-96 block mx-auto p-3'/>
          <h1 className='text-white text-3xl font-semibold text-center m-4 text-sky-400'>ABOUT GALILEO</h1>
          <p className='max-w-96 p-3 text-white text-sm font-normal'>Galileo is a basic object tracker designed for flexible development and with a smooth user experience in mind. The application currently uses <a className='text-sky-400' href='https://github.com/shashwatak/satellite-js'>satellite.js</a> and its SGP4 calculations for object propogation.</p>
          <p className='max-w-96 p-3 text-white text-sm font-normal'>Galileo displays a fullscreen rendering of earth and many satellites using <a className='text-sky-400' href='https://github.com/pmndrs/react-three-fiber'>@react-three-fiber</a> and <a className='text-sky-400' href='https://tailwindcss.com/'>Tailwind.css</a> to create & style the page. Galileo allows for past & future date manipulation and provides keyboard shortcuts for users to navigate between objects. The web-app features other visuals such as orbit displays, a dynamic hexasphere, and more</p>
          <p className='max-w-96 p-3 text-white text-sm font-normal'>Galileo may be updated in the future to allow use with live sensors & data and/or the ability to control local devices.</p>
          <h1 className='text-white text-3xl font-semibold text-center m-4 text-sky-400'>KEYBOARD SHORTCUTS</h1>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <Hotkey hotkey='Space' info='Play/Pause Time'/>
            <Hotkey hotkey='r' info='Reset to Now'/>
            <Hotkey hotkey='ArrowLeft' info='Decrease Speed'/>
            <Hotkey hotkey='ArrowRight' info='Increase Speed'/>
            <Hotkey hotkey='ArrowUp' info='Next Object'/>
            <Hotkey hotkey='ArrowDown' info='Previous Object'/>
            <Hotkey hotkey='i' info='Show About'/>
            <Hotkey hotkey='s' info='Show Settings'/>
            <Hotkey hotkey='Esc' info='Deselect'/>
          </div>
      </div>
    </div>}
    </>
  )
}

export default AboutPanel