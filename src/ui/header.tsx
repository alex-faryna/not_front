import cart from "../assets/cart.svg";
import search from '../assets/search.svg';

export function Header() {

  return <div className='flex justify-end h-60 p-[16px] gap-4'>
    <span className='text-xl mr-auto'>Not Store</span>
    <img src={search} alt='Search' width={22} height={22} />
    <img src={cart} alt='Cart' width={22} height={22} onClick={() => console.log("open cart")} />
  </div>
}