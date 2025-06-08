import {useCart, useItems, usePage, useSearch} from "../state/state.ts";
import {useEffect, useRef} from "react";
import checkIcon from '../assets/check.svg'
import {Carousel} from "../ui/carousel.tsx";
import {Text} from "@telegram-apps/telegram-ui";

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
    <div className='p-1 flex flex-col items-start'>
      <Text weight="2">{ item.name }</Text>
      <div className='flex gap-1'>
        <Text>{ item.price }</Text>
        <Text>{ item.currency }</Text>
      </div>
    </div>
  </div>
}


export function HomePage({ onSelect, isAnimating }) {
  const { setPage } = usePage();
  const { items, loadItems } = useItems();
  const { searchQuery } = useSearch();
  useEffect(() => void loadItems(), []);

  const onClick = (item: number, target: HTMLImageElement) => {
    onSelect(item, target);
    target.style.opacity = '0';
    setPage('item');
  }

  return <div className='page home relative'>
    <div className='grid-container'>
      <div className='grid'>
        {items.filter(item => item.name.includes(searchQuery)).map(item => <Item key={item.id} item={item} onClick={onClick} isAnimating={isAnimating} />)}
      </div>
    </div>
  </div>
}
