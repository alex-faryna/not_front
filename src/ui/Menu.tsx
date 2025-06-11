import {useLaunchParams} from "@telegram-apps/sdk-react";
import {useCart, useItems, usePage, usePurchase, useSearch} from "../state/state.ts";
import {Button} from "@telegram-apps/telegram-ui";

export function Menu() {
  const { tgWebAppData: { user } } = useLaunchParams();
  const {page, setPage} = usePage();

  const purchase = usePurchase();
  const { search } = useSearch();
  const { items } = useItems();
  const { cart } = useCart();
  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);
  const cartCost = Object.keys(cart)
    .filter(item => cart[item] > 0)
    .reduce((acc, curr) => acc + cart[curr] * (items.find(item => `${item.id}` === `${curr}`)?.price || 0), 0);

  return cartQuantity ? (
    !search && <div className='w-full min-h-[58px] p-2 pt-0'>
      <Button mode="filled" size="l" stretched={true} onClick={purchase} className='main-button'>
        Buy for { cartCost }
      </Button>
    </div>
  ) : (
    <div className='flex min-h-[49px] w-full justify-around' style={{ '--default-transition-duration': '250ms' }}>
      <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? 'opacity-30' : ''}`} onClick={() => setPage('home')}>
        <span className="icon-home text-[24px]"></span>
        <span className='text-[10px]'>Store</span>
      </div>
      <div className={`transition-opacity flex flex-col items-center justify-center ${page === 'profile' ? '' : 'opacity-30'}`} onClick={() => setPage('profile')}>
        <img src={user.photo_url} alt='profile icon' width={24} height={24} className='rounded-full' />
        <span className='text-[10px]'>{ user?.first_name } { user?.last_name }</span>
      </div>
    </div>
  );
}