import {usePurchase, useCart, useItems, useSearch} from "../state/state.ts";
import {useEffect, useRef, useState} from "react";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Button, IconButton, Modal, Placeholder, Text, Title} from "@telegram-apps/telegram-ui";
import {Icon16Cancel} from "@telegram-apps/telegram-ui/dist/icons/16/cancel";

function Search() {
  const { searchQuery, doSearch, clearSearch, search, setSearch } = useSearch();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && search) {
      const input = ref.current as HTMLInputElement;
      input.focus();
    }
  }, [ref, search]);

  return <div className='w-full h-full relative flex items-center p-2'>
    <div className='flex gap-2 items-center input-container grow-1'>
      <span className="icon-search text-[16px]"></span>
      <input ref={ref} className='input w-full' type='text' value={searchQuery} onChange={val => doSearch(val.target.value)} placeholder='Search' />
      { searchQuery && <IconButton mode='plain' size='s' onClick={clearSearch} className='secondary-button'>
        <Icon16Cancel/>
      </IconButton> }
    </div>
    <Button onClick={() => setSearch(false)} size='s' mode='plain' className='secondary-button'>
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

  const { search, setSearch } = useSearch();
  const purchase = usePurchase();

  return <>
    <div className='flex justify-end h-[60px] p-[16px] items-center relative' style={{ flex: '0 0 60px' }}>
      <div className={`absolute z-[10] top-0 left-0 w-full h-full bg-(--main-bg-color) transition-opacity ${search ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Search />
      </div>
      <Title weight="2">Not Store</Title>
      <IconButton mode='plain' size='s' onClick={() => setSearch(true)} className='secondary-button ml-auto'>
        <span className="icon-search text-[22px]"></span>
      </IconButton>
      { cartQuantity
        ? <div className={`rounded-full bg-(--main-color) ml-1 h-[22px] w-[22px] flex items-center justify-center`}
               onClick={() => setShowCart(true)}>
          <span className='text-(--main-bg-color)'>{ cartQuantity }</span>
        </div>
        : <IconButton mode='plain' size='s' onClick={() => setShowCart(true)} className='secondary-button'>
          <span className="icon-cart text-[22px]"></span>
        </IconButton> }
    </div>

    <Modal className='modal' overlayComponent={<div className='w-full h-full pointer-events-none'></div>}
           onOpenChange={setShowCart} header={<ModalHeader after={
      <Icon28Close onClick={() => setShowCart(false)} style={{color: 'var(--tgui--plain_foreground)'}} />
    }></ModalHeader> as any}
           open={showCart}
    >
      <div className='flex flex-col gap-2 p-2'>
        { Object.keys(cart).length
          ? <div className='flex flex-col h-full w-full gap-4'>
            { Object.keys(cart).map(id => items.find(item => `${item.id}` === id)).map(item => <div className='flex items-center w-full gap-2'>
              <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
              <div className='flex flex-col mr-auto'>
                <Text className='text-(--text-secondary)' style={{ '--tgui--text--font_size': '12px' }}>{ item.category }</Text>
                <Text>{ item.name }</Text>
              </div>
              <Text className='text-lg ml-auto'>{ item.price } { item.currency }</Text>
              <Text className='text-(--text-secondary)'>x { cart[item.id] }</Text>
              <IconButton
                mode="gray"
                size="m"
                onClick={() => removeItem(item.id)}
                className='cursor-pointer h-[28px] w-[28px] flex items-center justify-center minus-button'
              >
                <span className='icon-minus text-[2px] text-(--text-secondary)'></span>
              </IconButton>
            </div>) }
            <Button mode="filled" size="l" stretched={true} onClick={() => {
              setShowCart(false);
              purchase();
            }} className='main-button'>
              Buy for { cartCost } NOT
            </Button>
          </div>
          : <>
            <Placeholder header="Cart's cold"
                         description="No items yet" ></Placeholder>
            <Button onClick={() => setShowCart(false)} size="l" className='main-button'>OK</Button>
          </> }
      </div>
    </Modal>
  </>;
}