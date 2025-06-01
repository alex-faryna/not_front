import {useItem} from "../state/state.ts";

export function ItemPage({ref, isAnimating}) {
  const { item } = useItem();

  return <>
    <div className='page item'>
      <div ref={ref} className='hero' style={{opacity: isAnimating ? '0' : '1'}}>
        { item && <img src={item.images[0]} alt={`Item ${item.name}`} /> }
      </div>

      <span>Heello item {213}</span>
    </div>
  </>
}