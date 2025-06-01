import {useItems, usePage} from "../state/state.ts";
import {MouseEvent, useEffect} from "react";

export function HomePage({ onSelect }) {
  const { setPage } = usePage();
  const { items, loadItems } = useItems();
  useEffect(() => void loadItems(), []);

  const onClick = (item: number, event: MouseEvent) => {
    // find the image !!!
    const target = event.target as HTMLDivElement;
    onSelect(item, target);
    target.style.opacity = '0';
    setPage('item');
  }

  return <div className='page home'>
    <div className='grid'>
      {items.map((item) => (
        <div key={item.id} className='item' onClick={event => onClick(item.id, event)} >
          <img src={item.images[0]} alt={`Item ${item.name}`} />
          <span className='text-xl'>{ item.name }</span>
          <div className='flex gap-2'>
            <span className='text-xl'>{ item.price }</span>
            <span className='text-xl'>{ item.currency }</span>
          </div>
        </div>
      ))}
    </div>
    <span>Heello home</span>
  </div>
}
