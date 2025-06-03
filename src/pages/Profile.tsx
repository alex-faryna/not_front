import {useLaunchParams} from "@telegram-apps/sdk-react";
import {useHistory} from "../state/state.ts";
import {useEffect, useMemo} from "react";

export function ProfilePage() {
  const { tgWebAppData: { user } } = useLaunchParams();
  const { history, items, loadingHistory, loadHistory } = useHistory();

  const historyFull = useMemo(() => {
    return history.map(entry => ({
      ...entry,
      item: items.find(({ id }) => id === entry.id)
    }));
  }, [history, items]);

  useEffect(() => void loadHistory(), []);

  return <div className='page profile flex flex-col gap-1'>
    <div className='flex flex-col items-center justify-center h-[50%]'>
      <img src={user.photo_url} alt='profile icon' width={60} height={120} className='rounded-full' />
      <span className='text-2xl'>{ user?.first_name } { user?.last_name }</span>
    </div>
    { history.length ? <div className='flex flex-col items-start h-[50%] p-2'>
      <span className='text-2xl'>History</span>
      <div className='flex flex-col h-100 w-100 overflow-auto gap-2'>
        { historyFull.slice(0, 3).map(({ id, timestamp, item, total, currency}) => <div key={`${timestamp}-${id}`} className='flex items-center gap-2'>
          <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
          <div className='flex flex-col'>
            <span>{ item.category }</span>
            <span>{ item.name }</span>
          </div>
          <div className='flex flex-col ml-auto'>
            <span>{ (new Date(timestamp)).getDate() }</span>
            <span>{ total } { currency }</span>
          </div>
        </div>) }
      </div>
    </div> : <div className='flex flex-col items-center justify-center h-[50%]'>
      <span className='text-2xl'>No history yet</span>
      <span className='text-lg'>Let's change that</span>
    </div> }
  </div>;
}