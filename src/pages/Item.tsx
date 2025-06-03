import {useCart, useItem} from "../state/state.ts";
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

  return <>
    <div className='page item'>
      {item && <ItemInfo item={item}/>}

      <ItemCarousel ref={ref} id={item.id} slides={item.images.map((_, idx) => idx)} options={{ }}>
        { index => <div className='www w-100 relative'>
          <img className='absolute top-0 left-0 w-full h-full rounded-[20px]' src={item.images[index]} />
        </div> }
      </ItemCarousel>

      { /* <div ref={ref} className='hero' style={{opacity: isAnimating ? '0' : '1'}}>
        {item && <img src={item.images[0]} alt={`Item ${item.name}`}/>}
      </div> */ }

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