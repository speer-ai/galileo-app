import { chevronRight } from '../assets'
import { galileoLogo } from '../assets'

const AboutPanel = (props) => {

  return (
    <>
    {props.openPanel === 'about' &&
    <div className='absolute right-0 h-full flex flex-row slideIn animation-slideIn'>
      <button
          className='p-2 mt-5 m-2 w-12 h-12 cursor-pointer transform hover:translate-x-2 transition-transform duration-300 ease-in-out'
          onClick={() => props.openPanelHandler('none')}><img className='m-auto h-full' src={chevronRight} alt='rewind'/>
      </button> 
      
      <div className='bg-opacity-60 bg-stone-700 min-w-96'>
          <img
            src={galileoLogo}
            alt='Galileo Logo'
            className='max-w-96 block mx-auto p-3'/>
          <h1 className='text-white text-3xl font-semibold text-center m-4 text-sky-400'>ABOUT GALILEO</h1>
          <p className='max-w-96 p-3 text-white text-md font-normal'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, vitae quibusdam. Incidunt molestias quos voluptas, in facere minus? Nihil, repudiandae corporis cumque quasi accusantium aspernatur. Quam veritatis amet illum omnis sunt voluptatem asperiores. Sit id animi magni nostrum tenetur dignissimos, provident sed velit nam rem libero modi similique totam autem!</p>
          <p className='max-w-96 p-3 text-white text-md font-normal'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quam inventore sunt officiis ad aliquid cum commodi impedit atque in!</p>
          <p className='max-w-96 p-3 text-white text-md font-normal'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum repellendus provident ducimus explicabo officia quam sed blanditiis voluptatum eveniet aliquid odio eius ratione, corporis autem in earum alias doloribus quod.</p>
      </div>
    </div>}
    </>
  )
}

export default AboutPanel