import {useCart, useItem} from "../state/state.ts";
import {ItemCarousel} from "../ui/item-carousel.tsx";
import {Button} from "@telegram-apps/telegram-ui";

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

      <ItemCarousel key={item.id} ref={ref} id={item.id} slides={item.images.map((_, idx) => idx)} options={{ }}>
        { (index, main) => <div className='www w-100 relative' style={{opacity: main && isAnimating ? '0' : '1'}}>
          <img className='absolute top-0 left-0 w-full h-full rounded-[20px]' src={item.images[index]} />
        </div> }
      </ItemCarousel>

      <div className='flex gap-2 justify-around w-full'>
        {
          (cart[item.id] || 0)
          ? (
              <div className='flex gap-1 w-full rounded-[12px] items-center justify-center h-[50px]'
                   style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                <span className='cursor-pointer select-none' onClick={() => removeFromCart(item.id)}>-</span>
                <span className='flex items-center justify-center w-[2em] select-none cursor-default'>{cart[item.id]}</span>
                <span className='cursor-pointer select-none' onClick={() => addToCart(item.id)}>+</span>
              </div>
            )
          :
            <div className='w-full h-full'>
              <Button mode="filled" size="l" stretched={true} onClick={() => addToCart(item.id)}>
                Add to cart
              </Button>
            </div>
        }
        <div className='w-full h-full'>
          <Button mode="filled" size="l" stretched={true}>
            Buy now
          </Button>
        </div>
      </div>
    </div>
  </>
}