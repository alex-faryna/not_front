import {useCart, useItem, usePurchase} from "../state/state.ts";
import {ItemCarousel} from "../ui/item-carousel.tsx";
import {Button, Caption, Text, Title} from "@telegram-apps/telegram-ui";

function ItemInfo({item}) {

  return <div className='flex flex-col gap-2 items-start'>
    <Title weight="2">{ item.name }</Title>
    <span className='text-lg'>{item.description}</span>
    <div className='flex gap-2 items-center'>
      <div className='flex items-center gap1 rounded-[10px] h-[18px]' style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px' }}>
        <Caption>{item.price}</Caption>
        <Caption>{item.currency}</Caption>
      </div>

      <div className='flex gap1 items-center rounded-[10px] h-[18px]' style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px' }}>
        <Caption>{item.left}</Caption>
        <Caption>Left</Caption>
      </div>

      {item.tags?.['fabric'] && (
        <div className='flex gap1 items-center rounded-[10px] h-[18px]' style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px' }}>
          <Caption>{item.tags.fabric}</Caption>
        </div>
      )}
    </div>
  </div>;
}

export function ItemPage({ref, isAnimating}) {
  const {item} = useItem();
  const {cart, addToCart, removeFromCart} = useCart();
  const purchase = usePurchase();

  return <>
    <div className='page item gap-3'>
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
              <div className='flex gap-1 w-full rounded-[12px] items-center justify-center h-[50px] bg-(--secondary-bg-color)'>
                <Button onClick={() => removeFromCart(item.id)} size='s' mode='plain' className='secondary-button'>
                  <Text weight="1">-</Text>
                </Button>
                <Text weight="1" className='flex items-center justify-center w-[2em] select-none cursor-default'>{cart[item.id]}</Text>
                <Button onClick={() => addToCart(item.id)} size='s' mode='plain' className='secondary-button'>
                  <Text weight="1">+</Text>
                </Button>
              </div>
            )
          :
            <div className='w-full h-full'>
              <Button mode="filled" size="l" stretched={true} onClick={() => addToCart(item.id)} className='main-button'>
                Add to cart
              </Button>
            </div>
        }
        <div className='w-full h-full'>
          <Button mode="filled" size="l" stretched={true} onClick={purchase} className='main-button'>
            Buy now 22
          </Button>
        </div>
      </div>
    </div>
  </>
}