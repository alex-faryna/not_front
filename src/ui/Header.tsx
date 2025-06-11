import cartIcon from "../assets/cart.svg";
import searchIcon from '../assets/search.svg';
import minusIcon from '../assets/minus.svg';
import {usePurchase, useCart, useItems, useSearch} from "../state/state.ts";
import {useEffect, useRef, useState} from "react";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Button, IconButton, Modal, Placeholder, Text, Title} from "@telegram-apps/telegram-ui";
import {THEME, useTonConnectUI} from "@tonconnect/ui-react";
import {Icon16Cancel} from "@telegram-apps/telegram-ui/dist/icons/16/cancel";

function Search({ search, setSearch }) {
  const { searchQuery, doSearch, clearSearch } = useSearch();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && search) {
      const input = ref.current as HTMLInputElement;
      input.focus();
    }
  }, [ref, search]);

  return <div className='w-full h-full bg-black-500 relative flex gap-2 items-center'>
    <div className='flex gap-2 items-center input-container grow-1'>
      <img src={searchIcon} alt='Search' width={16} height={16} />
      <input ref={ref} className='input w-full' type='text' value={searchQuery} onChange={val => doSearch(val.target.value)} placeholder='Search' />
      { searchQuery && <IconButton mode='plain' size='s' onClick={clearSearch}>
        <Icon16Cancel/>
      </IconButton> }
    </div>
    <Button onClick={() => {
      clearSearch();
      setSearch(false);
    }} size='s' mode='plain'>
      <Text className='cursor-pointer'>Cancel</Text>
    </Button>
  </div>
}

export function Header() {
  const { cart, removeFromCart } = useCart();
  const { items } = useItems();
  const [showCart, setShowCart] = useState(false);
  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);
  const totalCartQuantity = Object.keys(cart).reduce((acc, curr) => acc + (cart[curr] || 0), 0);
  const cartCost = Object.keys(cart)
    .filter(item => cart[item] > 0)
    .reduce((acc, curr) => acc + cart[curr] * (items.find(item => `${item.id}` === `${curr}`)?.price || 0), 0);

  const removeItem = (id: number) => {
    if(totalCartQuantity <= 1) {
      setShowCart(false);
    }
    setTimeout(() => {
      removeFromCart(id); // TODO: animation here
    });
  }

  const [search, setSearch] = useState(false);
  const purchase = usePurchase();

  return <>
    <div className='flex justify-end h-[60px] p-[16px] gap-4 items-center relative' style={{ flex: '0 0 60px' }}>
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity ${search ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Search search={search} setSearch={setSearch} />
      </div>
      <Title weight="2">Not Store</Title>
      <img src={searchIcon} alt='Search' width={22} height={22} className='ml-auto' onClick={() => setSearch(true)} />
      { cartQuantity
        ? <div className={`rounded-full bg-white h-[22px] w-[22px] flex items-center justify-center`}
               onClick={() => setShowCart(true)}>
          <span className='text-black'>{ cartQuantity }</span>
        </div>
        : <img src={cartIcon} alt='Cart' width={22} height={22} onClick={() => setShowCart(true)} /> }
    </div>

    <Modal onOpenChange={setShowCart} header={<ModalHeader after={
      <Icon28Close onClick={() => setShowCart(false)} style={{color: 'var(--tgui--plain_foreground)'}} />
    }></ModalHeader> as any}
           open={showCart}
    >
      <div className='flex flex-col gap-2 p-2'>
        { Object.keys(cart).length
          ? <div className='flex flex-col h-full w-full gap-2'>
            { Object.keys(cart).map(id => items.find(item => `${item.id}` === id)).map(item => <div className='flex items-center w-full gap-2'>
              <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
              <div className='flex flex-col'>
                <Text>{ item.category }</Text>
                <Text>{ item.name }</Text>
              </div>
              <span className='text-lg ml-auto'>{ item.price } { item.currency }</span>
              <span>x { cart[item.id] }</span>
              <IconButton
                mode="gray"
                size="m"
                onClick={() => removeItem(item.id)}
              >
                <img src={minusIcon} width={14} height={2} />
              </IconButton>
            </div>) }
            <Button mode="filled" size="l" stretched={true} onClick={() => {
              setShowCart(false);
              purchase();
            }}>
              Buy for { cartCost }
            </Button>
          </div>
          : <>
            <Placeholder header="Cart's cold"
                         description="No items yet" ></Placeholder>
            <Button onClick={() => setShowCart(false)} size="l">OK</Button>
          </> }
      </div>
    </Modal>
  </>;
}