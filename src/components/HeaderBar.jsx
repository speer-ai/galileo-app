
import { logo } from '../assets'

const HeaderBar = () => {
    return (
        <nav className='width-full bg-red-200 flex gap-4 justify-between items-center p-4'>
            <p className="text-[30px]">Galileo Interface</p>
            <img src={logo} className='w-12 h-12'></img>
        </nav>
    )
}

export default HeaderBar