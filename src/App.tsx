import './App.css'
import {useItems, usePage} from "./state/state.ts";
import {useEffect, useRef, MouseEvent, useState} from "react";
import {backButton} from "@telegram-apps/sdk-react";

function Profile() {
  return <div className='page profile'>
    Hello profile
  </div>;
}

function Home({onAnimation}) {
  const { setPage } = usePage();
  const { items, loadItems } = useItems();
  useEffect(() => void loadItems(), []);

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement;
    onAnimation(target);
    target.style.opacity = '0';
    setPage('item');
  }

  return <div className='page home'>
    <div className='grid'>
      {items.map((item) => (
        <div key={item.id} className='item' onClick={onClick}>{item.name}</div>
      ))}
    </div>
    <span>Heello home</span>
  </div>
}

function HeroItem({isAnimating, from, to}: { from: HTMLDivElement, to: HTMLDivElement }) {
  const {page} = usePage();
  const forward = page === 'item';
  const hero = useRef<HTMLDivElement>(null as HTMLDivElement);

  useEffect(() => {
    if(!to || !from) return;
    const _from = from.getBoundingClientRect();
    const _to = to.getBoundingClientRect();

    hero.current.animate([
      {
        visibility: 'visible',
        transform: `translate(${_from.left - _from.width / 2}px, ${_from.top - _from.width / 2}px) scale(${_from.width / _to.width})`,
      },
      {
        visibility: 'visible',
        transform: `translate(${to.offsetLeft}px, ${_to.top}px) scale(1)`
      }
    ], {duration: 250, easing: 'ease-out', fill: 'both', direction: forward ? 'normal' : 'reverse'});
  }, [isAnimating]);

  return <div style={{opacity: isAnimating ? '1' : '0'}} ref={hero} className='hero-item'></div>
}

function Item({ref, isAnimating}) {
  return <>
    <div className='page item'>
      <div ref={ref} className='hero' style={{opacity: isAnimating ? '0' : '1'}}>
        Hero
      </div>

      <span>Heello item {213}</span>
    </div>
  </>
}

function App() {
  const {page, setPage} = usePage();

  useEffect(() => {
    if(page === 'item') {
      backButton.show();
    } else {
      backButton.hide();
    }

    const offClick = backButton.onClick(() => {
      setPage('home');
      setHeroAnimation(true);
    });

    return () => {
      offClick();
      backButton.hide();
    }
  }, [page]);

  const [heroAnimation, setHeroAnimation] = useState(false);
  const [targetElem, setTargetElem] = useState<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null as HTMLDivElement);

  useEffect(() => {
    if(!heroAnimation && targetElem && page === 'home') {
      // hero.current.style.opacity = '1';
      // hero.current = null as HTMLDivElement;
      targetElem.style.opacity = '1';
      setTargetElem(null);
    }
  }, [heroAnimation]);

  return <div className='main'>
    <div className='main-layout'>
      <div className='main-container' style={{transform: `translateX(${page === 'profile' ? '-100%' : '0'})`}}>
        <Home onAnimation={elem => {
          setTargetElem(elem);
          setHeroAnimation(true);
        }}/>
      </div>
      <div className='side-container' onTransitionEnd={() => setHeroAnimation(false)}
           style={{transform: `translateX(${page === 'item' ? '-100%' : '0'})`}}>
        <Item ref={hero} isAnimating={heroAnimation}/>
      </div>
      <HeroItem isAnimating={heroAnimation} from={targetElem} to={hero.current}/>
      <div className='profile-container' style={{transform: `translateX(${page === 'profile' ? '-100%' : '0'})`}}>
        <Profile/>
      </div>
    </div>
    <div className='menu'>
      <span onClick={() => setPage('home')}>Home</span>
      <span onClick={() => setPage('profile')}>Profile</span>
    </div>
  </div>;
}

export default App
