import {useLaunchParams} from "@telegram-apps/sdk-react";
import {useHistory} from "../state/state.ts";
import {useEffect, useMemo} from "react";
import {Spinner, Text, Title} from "@telegram-apps/telegram-ui";

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
                  <Text className='text-(--text-secondary)'>{ item.category }</Text>
                  <Text>{ item.name }</Text>
                </div>
                <div className='flex flex-col ml-auto'>
                  <Text className='text-(--text-secondary)'>{ (new Date(timestamp)).toISOString() }</Text>
                  <Text>{ total } { currency }</Text>
                </div>
              </div>) }
            </div>
          </div> : <div className='flex flex-col items-center justify-center grow-1 gap-2'>
            <Title level="1" weight="2">No history yet</Title>
            <Text className='text-(--text-secondary)'>Let's change that</Text>
          </div>
      ) }
  </div>;
}