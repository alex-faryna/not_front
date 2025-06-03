import cartIcon from "../assets/cart.svg";
import searchIcon from '../assets/search.svg';
import {useCart} from "../state/state.ts";
import {useState} from "react";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Button, Modal, Placeholder} from "@telegram-apps/telegram-ui";

export function Header() {
  const { cart } = useCart();
  const [showCart, setShowCart] = useState(false);

  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);

  return <>
    <div className='flex justify-end h-[60px] p-[16px] gap-4 items-center' style={{ flex: '0 0 60px' }}>
      <span className='text-xl mr-auto'>Not Store</span>
      <img src={searchIcon} alt='Search' width={22} height={22} />
      { cartQuantity
        ? <div className={`rounded-full bg-white h-[22px] w-[22px] flex items-center justify-center`}>
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
        { cart.length
          ? ''
          : <>
            <Placeholder header="Cart's cold"
                         description="No items yet" ></Placeholder>
            <Button onClick={() => setShowCart(false)} size="m">OK</Button>
          </> }
      </div>
    </Modal>
  </>;
}