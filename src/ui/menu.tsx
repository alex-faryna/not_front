import {useLaunchParams} from "@telegram-apps/sdk-react";
import homeLogo from '../assets/home.svg'
import {usePage} from "../state/state.ts";

export function Menu() {
  const { tgWebAppData: { user } } = useLaunchParams();
  const {page, setPage} = usePage();

  return <div className='flex justify-around h-49' style={{ '--default-transition-duration': '250ms' }}>
    <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? 'opacity-20' : ''}`} onClick={() => setPage('home')}>
      <img src={homeLogo} alt='profile icon' width={24} height={24} className='rounded-full' />
      Store
    </div>
    <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? '' : 'opacity-20'}`} onClick={() => setPage('profile')}>
      <img src={user.photo_url} alt='profile icon' width={24} height={24} className='rounded-full' />
      { user?.first_name } { user?.last_name }
    </div>
  </div>;
}