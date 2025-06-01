import './App.css'
import {useItem, usePage} from "./state/state.ts";
import {useEffect, useRef, useState} from "react";
import {backButton} from "@telegram-apps/sdk-react";
import {ProfilePage} from "./pages/profile.tsx";
import {ItemPage} from "./pages/item.tsx";
import {HomePage} from "./pages/home.tsx";

function HeroItem({ isAnimating, from, to }: { from: HTMLDivElement, to: HTMLDivElement }) {
  const {page} = usePage();
  const forward = page === 'item';
  const hero = useRef<HTMLDivElement>(null as HTMLDivElement);
  const { item } = useItem();

  useEffect(() => {
    if(!to || !from) return;
    const _from = from.getBoundingClientRect();
    const _to = to.getBoundingClientRect();

    hero.current.animate([
      {
        borderRadius: '16px',
        visibility: 'visible',
        transform: `translate(${_from.left - _from.width / 2}px, ${_from.top - _from.width / 2}px) scale(${_from.width / _to.width})`,
      },
      {
        borderRadius: '20px',
        visibility: 'visible',
        transform: `translate(${to.offsetLeft}px, ${_to.top}px) scale(1)`
      }
    ], {duration: 300, easing: 'ease-out', fill: 'both', direction: forward ? 'normal' : 'reverse'});
  }, [isAnimating]);

  return <div style={{opacity: isAnimating ? '1' : '0'}} ref={hero} className='hero-item'>
    { isAnimating && <img src={item.images[0]} alt={`Item ${item.name}`} /> }
  </div>
}

function App() {
  const {page, setPage} = usePage();
  const { select } = useItem();

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
      targetElem.style.opacity = '1';
      setTargetElem(null);
    }
  }, [heroAnimation]);

  return <div className='main'>
    <div className='main-layout'>
      <div className='main-container' style={{transform: `translateX(${page === 'profile' ? '-100%' : '0'})`}}>
        <HomePage onSelect={(item, elem) => {
          select(item);
          setTargetElem(elem);
          setHeroAnimation(true);
        }}/>
      </div>
      <div className='side-container' onTransitionEnd={() => setHeroAnimation(false)}
           style={{transform: `translateX(${page === 'item' ? '-100%' : '0'})`}}>
        <ItemPage ref={hero} isAnimating={heroAnimation}/>
      </div>
      <HeroItem isAnimating={heroAnimation} from={targetElem} to={hero.current}/>
      <div className='profile-container' style={{transform: `translateX(${page === 'profile' ? '-100%' : '0'})`}}>
        <ProfilePage/>
      </div>
    </div>
    <div className='menu'>
      <span onClick={() => setPage('home')}>Home</span>
      <span onClick={() => setPage('profile')}>Profile</span>
    </div>
  </div>;
}

export default App
