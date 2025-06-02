import {useLaunchParams} from "@telegram-apps/sdk-react";
import homeLogo from '../assets/home.svg'
import {usePage} from "../state/state.ts";

export function Menu() {
  const { tgWebAppData: { user } } = useLaunchParams();
  const {page, setPage} = usePage();

  return <div className='flex justify-around h-[49px]' style={{ '--default-transition-duration': '250ms', background: 'black' }}>
    <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? 'opacity-30' : ''}`} onClick={() => setPage('home')}>
      <img src={homeLogo} alt='profile icon' width={24} height={24} className='rounded-full' />
      <span className='text-[10px]'>Store</span>
    </div>
    <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? '' : 'opacity-30'}`} onClick={() => setPage('profile')}>
      <img src={user.photo_url} alt='profile icon' width={24} height={24} className='rounded-full' />
      <span className='text-[10px]'>{ user?.first_name } { user?.last_name }</span>
    </div>
  </div>;
}