import {useCart, useItem} from "../state/state.ts";
import {useEffect} from "react";

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
  const {cart, addToCart} = useCart();

  return <>
    <div className='page item'>
      {item && <ItemInfo item={item}/>}

      <div ref={ref} className='hero' style={{opacity: isAnimating ? '0' : '1'}}>
        {item && <img src={item.images[0]} alt={`Item ${item.name}`}/>}
      </div>

      <div className='flex gap-2'>
        {(cart[item.id] || 0) ? <span>- {cart[item.id]} +</span> : <span onClick={() => {
          addToCart(item.id);
          console.log(item.id);
        }}>Add to cart</span>}
        <span>Buy now</span>
      </div>
    </div>
  </>
}