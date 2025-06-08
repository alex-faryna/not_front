import {useCart, useItems, usePage, useSearch} from "../state/state.ts";
import {useEffect, useRef} from "react";
import checkIcon from '../assets/check.svg'
import {Header} from "../ui/header.tsx";
import {Carousel} from "../ui/carousel.tsx";
import {Button} from "@telegram-apps/telegram-ui";

function Item({ item, onClick, isAnimating }) {
  const { cart } = useCart();
  const ref = useRef(null);

  return <div key={item.id} className='item relative' onClick={() => onClick(item.id, ref.current)}>
    <Carousel ref={ref} id={item.id} slides={item.images.map((_, idx) => idx)}>
      { index => <div className='relative w-full h-full aspect-square'>
        <img className='absolute top-0 left-0 w-full h-full rounded-[16px]' src={item.images[index]} />
      </div> }
    </Carousel>
    { cart[item.id] && <div className={`transition-opacity rounded-full bg-white h-[22px] w-[22px] absolute top-[8px] right-[8px] flex items-center justify-center ${isAnimating ? 'opacity-0' : ''}`}>
      <img src={checkIcon} alt='Added to cart' width={12} height={12} />
    </div> }
    <span className='text-xl'>{ item.name }</span>
    <div className='flex gap-2'>
      <span className='text-xl'>{ item.price }</span>
      <span className='text-xl'>{ item.currency }</span>
    </div>
  </div>
}


export function HomePage({ onSelect, isAnimating }) {
  const { setPage } = usePage();
  const { items, loadItems } = useItems();
  const { searchQuery } = useSearch();
  useEffect(() => void loadItems(), []);

  const { cart } = useCart();
  const cartQuantity = Object.keys(cart).reduce((acc, curr) => acc + +!!cart[curr], 0);
  const cartCost = Object.keys(cart)
    .filter(item => cart[item] > 0)
    .reduce((acc, curr) => acc + cart[curr] * (items.find(item => `${item.id}` === `${curr}`)?.price || 0), 0);

  const onClick = (item: number, target: HTMLImageElement) => {
    onSelect(item, target);
    target.style.opacity = '0';
    setPage('item');
  }

  return <div className='page home relative'>
    <Header />
    <div className='grid-container'>
      <div className='grid'>
        {items.filter(item => item.name.includes(searchQuery)).map(item => <Item key={item.id} item={item} onClick={onClick} isAnimating={isAnimating} />)}
      </div>
    </div>
    { !!cartQuantity && <div className='absolute w-full bottom-[-50px] left-[0] right-[0] height-[58px]'>
      <Button mode="filled" size="l" stretched={true}>
        Buy for { cartCost }
      </Button>
    </div> }
  </div>
}
