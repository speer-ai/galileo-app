import { galileoBanner } from "../assets"

const Load = () => {
  return (
    <div className="bg-black relative w-full">
      <img
        src={galileoBanner}
        alt='Galileo Logo'
        className='block mx-auto p-3 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3'/>
    </div>
  )
}

export default Load