import {useCart, useItem} from "../state/state.ts";
import useEmblaCarousel from "embla-carousel-react";
import {ItemCarousel} from "../ui/item-carousel.tsx";

function ItemInfo({item}) {

  return <div className='flex flex-col gap-2 items-start'>
    <span className='text-2xl'>{item.name}</span>
    <span className='text-lg'>{item.description}</span>
    <div className='flex gap-2 items-center'>
      <div className='flex gap1'>
        <span>{item.price}</span>
        <span>{item.currency}</span>
      </div>

      <div className='flex gap1'>
        <span>{item.left}</span>
        <span>Left</span>
      </div>

      {item.tags?.['fabric'] && (
        <div className='flex gap1'>
          <span>{item.tags.fabric}</span>
        </div>
      )}
    </div>
  </div>;
}

export function ItemPage({ref, isAnimating}) {
  const {item} = useItem();
  const {cart, addToCart, removeFromCart} = useCart();

  const [emblaRef] = useEmblaCarousel()

  return <>
    <div className='page item'>
      {item && <ItemInfo item={item}/>}

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">Slide 1</div>
          <div className="embla__slide">Slide 2</div>
          <div className="embla__slide">Slide 3</div>
        </div>
      </div>

      <ItemCarousel slides={[1, 2, 3, 4, 5, 6, 7, 8]} />

      <div ref={ref} className='hero' style={{opacity: isAnimating ? '0' : '1'}}>
        {item && <img src={item.images[0]} alt={`Item ${item.name}`}/>}
      </div>

      <div className='flex gap-2 justify-around'>
        {
          (cart[item.id] || 0)
          ? (
              <div className='flex gap-1'>
                <span onClick={() => removeFromCart(item.id)}>-</span>
                <span>{cart[item.id]}</span>
                <span onClick={() => addToCart(item.id)}>+</span>
              </div>
            )
          : <span onClick={() => {
            addToCart(item.id);
            console.log(item.id);
          }}>Add to cart</span>
        }
        <span>Buy now</span>
      </div>
    </div>
  </>
}