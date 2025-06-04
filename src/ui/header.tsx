import cartIcon from "../assets/cart.svg";
import searchIcon from '../assets/search.svg';
import minusIcon from '../assets/minus.svg';
import {useCart, useItems} from "../state/state.ts";
import {useState} from "react";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Button, IconButton, Modal, Placeholder} from "@telegram-apps/telegram-ui";

export function Header() {
  const { cart, removeFromCart } = useCart();
  const { items } = useItems();
  const [showCart, setShowCart] = useState(false);
  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);
  const totalCartQuantity = Object.keys(cart).reduce((acc, curr) => acc + (cart[curr] || 0), 0);

  const removeItem = (id: number) => {
    if(totalCartQuantity <= 1) {
      setShowCart(false);
    }
    setTimeout(() => {
      removeFromCart(id);
    });
  }

  return <>
    <div className='flex justify-end h-[60px] p-[16px] gap-4 items-center' style={{ flex: '0 0 60px' }}>
      <span className='text-xl mr-auto'>Not Store</span>
      <img src={searchIcon} alt='Search' width={22} height={22} />
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
      <div className='flex flex-col gap-2'>
        { Object.keys(cart).length
          ? <div className='flex flex-col h-full w-full'>
            { Object.keys(cart).map(id => items.find(item => `${item.id}` === id)).map(item => <div className='flex items-center w-full gap-2 p-2'>
              <img src={item.images[0]} alt={`Item ${item.name}`} width={60} height={60} className='h-[60px] rounded-[12px]' />
              <div className='flex flex-col'>
                <span>{ item.category }</span>
                <span>{ item.name }</span>
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
          </div>
          : <>
            <Placeholder header="Cart's cold"
                         description="No items yet" ></Placeholder>
            <Button onClick={() => setShowCart(false)} size="m">OK</Button>
          </> }
      </div>
    </Modal>
  </>;
}