import {useLaunchParams} from "@telegram-apps/sdk-react";
import {useHistory, useItems} from "../state/state.ts";
import {useEffect, useMemo} from "react";
import {Title, Text, Spinner} from "@telegram-apps/telegram-ui";

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

  return <div className='flex flex-col h-full max-h-full w-full gap-1'>
    <div className='flex flex-col items-center justify-center h-[240px]'>
      <img src={user.photo_url} alt='profile icon' width={120} height={120} className='rounded-full' />
      <Title level="1" weight="2">{ user?.first_name } { user?.last_name }</Title>
    </div>
    { loadingHistory
      ? <div className='w-full h-full flex items-center justify-center'>
        <Spinner size="m" className='loader' />
      </div>
      : (
        history.length ? <div className='flex flex-col min-h-0 items-start grow-0 p-2'>
            <Title level="3" weight="1">History</Title>
            <div className='flex flex-col w-full grow-1 overflow-auto gap-3'>
              { historyFull.map(({ id, timestamp, item, total, currency}) => item?.images?.length && <div key={`${timestamp}-${id}`} className='flex items-center gap-2'>
                <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
                <div className='flex flex-col items-start'>
                  <span>{ item.category }</span>
                  <Text weight="1">{ item.name }</Text>
                </div>
                <div className='flex flex-col ml-auto'>
                  <span>{ (new Date(timestamp)).toISOString() }</span>
                  <span>{ total } { currency }</span>
                </div>
              </div>) }
            </div>
          </div> : <div className='flex flex-col items-center justify-center grow-1 gap-2'>
            <Title level="1" weight="2">No history yet</Title>
            <Text>Let's change that</Text>
          </div>
      ) }
  </div>

  return <div className='page profile flex flex-col gap-1'>
    <div className='flex flex-col items-center justify-center h-[240px]'>
      <img src={user.photo_url} alt='profile icon' width={120} height={120} className='rounded-full' />
      <Title level="1" weight="2">{ user?.first_name } { user?.last_name }</Title>
    </div>
    { history.length ? <div className='flex flex-col items-start h-[50%] p-2'>
      <Title level="3" weight="1">History</Title>
      <div className='flex flex-col h-100 w-full overflow-auto gap-3'>
        { historyFull.map(({ id, timestamp, item, total, currency}) => item?.images?.length && <div key={`${timestamp}-${id}`} className='flex items-center gap-2'>
          <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
          <div className='flex flex-col items-start'>
            <span>{ item.category }</span>
            <Text weight="1">{ item.name }</Text>
          </div>
          <div className='flex flex-col ml-auto'>
            <span>{ (new Date(timestamp)).toISOString() }</span>
            <span>{ total } { currency }</span>
          </div>
        </div>) }
      </div>
    </div> : <div className='flex flex-col items-center justify-center h-[50%] gap-2'>
      <Title level="1" weight="2">No history yet</Title>
      <Text>Let's change that</Text>
    </div> }
  </div>;
}