import {useActiveImage, useCart, useItems, usePage} from "../state/state.ts";
import {MouseEvent, useEffect, useState} from "react";
import checkIcon from '../assets/check.svg'
import {Header} from "../ui/header.tsx";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {Modal, Placeholder} from "@telegram-apps/telegram-ui";

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
            <img className='img' src={item.images[activeImages[item.id] || 0]} alt={`Item ${item.name}`} />
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
