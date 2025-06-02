import cartIcon from "../assets/cart.svg";
import searchIcon from '../assets/search.svg';
import {useCart} from "../state/state.ts";

export function Header() {
  const { cart } = useCart();

  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);

  return <div className='flex justify-end h-[60px] p-[16px] gap-4 items-center'>
    <span className='text-xl mr-auto'>Not Store</span>
    <img src={searchIcon} alt='Search' width={22} height={22} />
    { cartQuantity
      ? <div className={`rounded-full bg-white h-[22px] w-[22px] flex items-center justify-center`}>
          <span className='text-black'>{ cartQuantity }</span>
        </div>
      : <img src={cartIcon} alt='Cart' width={22} height={22} onClick={() => console.log("open cart")} /> }
  </div>
}