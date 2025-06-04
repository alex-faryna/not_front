import {useActiveImage, useCart, useItems, usePage} from "../state/state.ts";
import {MouseEvent, useEffect, useState} from "react";
import checkIcon from '../assets/check.svg'
import {Header} from "../ui/header.tsx";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Modal, Placeholder} from "@telegram-apps/telegram-ui";
import {Carousel} from "../ui/carousel.tsx";

export function HomePage({ onSelect, isAnimating }) {
  const { setPage } = usePage();
  const { items, loadItems } = useItems();
  const { activeImages } = useActiveImage();
  const { cart } = useCart();
  useEffect(() => void loadItems(), []);

  const onClick = (item: number, event: MouseEvent) => {
    // find the image !!!
    const target = event.target as HTMLDivElement;
    onSelect(item, target);
    target.style.opacity = '0';
    setPage('item');
  }

  return <div className='page home'>
    <Header />
    <div className='grid-container'>
      <div className='grid'>
        {items.map((item) => (
          <div key={item.id} className='item relative' onClick={event => onClick(item.id, event)}>
            <Carousel id={item.id} slides={item.images.map((_, idx) => idx + 1)}>
              { index => <div className='relative w-full h-full aspect-square'>
                <img className='absolute top-0 left-0 w-full h-full rounded-[20px]' src={item.images[index - 1]} />
              </div> }
            </Carousel>
            { /* <img className='img' src={item.images[activeImages[item.id] || 0]} alt={`Item ${item.name}`} /> */ }
            { cart[item.id] && <div className={`transition-opacity rounded-full bg-white h-[22px] w-[22px] absolute top-[8px] right-[8px] flex items-center justify-center ${isAnimating ? 'opacity-0' : ''}`}>
              <img src={checkIcon} alt='Added to cart' width={12} height={12} />
            </div> }
            <span className='text-xl'>{ item.name }</span>
            <div className='flex gap-2'>
              <span className='text-xl'>{ item.price }</span>
              <span className='text-xl'>{ item.currency }</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
}
