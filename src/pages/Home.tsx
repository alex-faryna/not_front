import {useCart, useItems, usePage, useSearch} from "../state/state.ts";
import {useEffect, useRef} from "react";
import {Carousel} from "../ui/carousel.tsx";
import {Placeholder, Spinner, Text} from "@telegram-apps/telegram-ui";

function Item({ item, onClick, isAnimating }) {
  const { cart } = useCart();
  const ref = useRef(null);

  return <div key={item.id} className='item relative' onClick={() => onClick(item.id, ref.current)}>
    <Carousel ref={ref} id={item.id} slides={item.images.map((_, idx) => idx)}>
      { index => <div className='relative w-full h-full aspect-square'>
        <img className='absolute top-0 left-0 w-full h-full rounded-[16px]' src={item.images[index]} />
      </div> }
    </Carousel>
    { cart[item.id] && <div className={`transition-opacity rounded-full bg-(--main-color) h-[22px] w-[22px] absolute top-[8px] right-[8px] flex items-center justify-center ${isAnimating ? 'opacity-0' : ''}`}>
      <span className="icon-check text-[12px] text-(--main-bg-color)"></span>
    </div> }
    <div className='p-1 flex flex-col items-start'>
      <Text weight="2">{ item.name }</Text>
      <div className='flex gap-1'>
        <Text>{ item.price }</Text>
        <Text className='text-(--text-secondary)'>{ item.currency }</Text>
      </div>
    </div>
  </div>
}

export function HomePage({ onSelect, isAnimating }) {
  const { setPage } = usePage();
  const { items, loadItems, loading } = useItems();
  const { searchQuery } = useSearch();
  useEffect(() => void loadItems(), []);

  const onClick = (item: number, target: HTMLImageElement) => {
    onSelect(item, target);
    setPage('item');
  }

  const gridItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return <div className='page home relative'>
    { loading ? (
      <div className='w-full h-full flex items-center justify-center'>
        <Spinner size="m" className='loader' />
      </div>
    ) : (
      <div className='grid-container items-stretch'>
        { gridItems.length ? (
          <div className='grid'>
            { gridItems.map(item => <Item key={item.id} item={item} onClick={onClick} isAnimating={isAnimating} />) }
          </div>
        ) : (
          <div className='flex items-center justify-center w-full h-full'>
            <Placeholder
              description="This item does not exist"
              header="Not found"
            ></Placeholder>
          </div>
        ) }
      </div>
    ) }
  </div>
}
