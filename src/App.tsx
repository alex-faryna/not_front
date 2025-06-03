import './App.css'
import './Embla.css'
import {useActiveImage, useItem, usePage} from "./state/state.ts";
import {act, useEffect, useRef, useState} from "react";
import {backButton, viewport} from "@telegram-apps/sdk-react";
import {ProfilePage} from "./pages/profile.tsx";
import {ItemPage} from "./pages/item.tsx";
import {HomePage} from "./pages/home.tsx";
import {Menu} from "./ui/menu.tsx";

function HeroItem({ isAnimating, from, to }: { from: HTMLDivElement, to: HTMLDivElement }) {
  const {page} = usePage();
  const forward = page === 'item';
  const hero = useRef<HTMLDivElement>(null as HTMLDivElement);
  const { item } = useItem();
  const { activeImages } = useActiveImage();

  useEffect(() => {
    if(!to || !from) return;
    const _from = from.getBoundingClientRect();
    const _to = to.getBoundingClientRect();

    const heroElement = hero.current.firstChild as HTMLImageElement;
    if (forward) {
      heroElement.style.width = `${_to.width}px`;
      heroElement.style.height = `${_to.height}px`;
      heroElement.animate([
        {
          borderRadius: '16px',
          transform: `translate(${_from.left}px, ${_from.top}px) scale(${_from.width / _to.width}, ${_from.height / _to.height})`, // - half of item mb
        },
        {
          borderRadius: '20px',
          transform: `translate(${to.offsetLeft}px, ${_to.top}px) scale(1, 1)`,
        }
      ], {duration: 400, easing: 'ease-out', fill: 'both' });
    } else {
      heroElement.style.width = `${_from.width}px`;
      heroElement.style.height = `${_from.height}px`;
      heroElement.animate([
        {
          borderRadius: '20px',
          transform: `translate(${to.offsetLeft}px, ${_to.top}px) scale(${_to.width / _from.width}, ${_to.height / _from.height})`, // - half of item mb
        },
        {
          borderRadius: '16px',
          transform: `translate(${_from.left}px, ${_from.top}px) scale(1, 1)`,
        },
      ], {duration: 400, easing: 'ease-out', fill: 'both' });
    }
  }, [isAnimating]);

  if(!item) return null;

  return <div ref={hero}>
    { item && <img style={{opacity: isAnimating ? '1' : '0'}} className='hero-item' src={item.images[activeImages[item.id] || 0]} alt={`Item ${item.name}`} /> }
  </div>;
}

function App() {
  const {page, setPage} = usePage();
  const { item, select } = useItem();

  useEffect(() => {
    (async () => {

      console.log(viewport);

      if (viewport.mount.isAvailable()) {
        try {
          const promise = viewport.mount();
          console.log(viewport.isMounting(), viewport.isMounted());
          await promise;
          console.log(viewport.isMounting(), viewport.isMounted());

        } catch (err) {
          console.log('133');
          console.log(err);
          console.log(viewport.mountError());
          console.log(viewport.isMounting(), viewport.isMounted());
        }

        // await viewport.mount();
        console.log('mounted??');
        if (viewport.bindCssVars.isAvailable()) {
          console.log("available");
          viewport.bindCssVars();
        }
      } else {
        console.log('not');
      }
    })();
  }, []);

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
        <HomePage isAnimating={heroAnimation} onSelect={(item, elem) => {
          select(item);
          setTimeout(() => {
            setTargetElem(elem);
            setHeroAnimation(true);
          });
        }}/>
      </div>
      <div className='side-container' onTransitionEnd={() => setHeroAnimation(false)}
           style={{transform: `translateX(${page === 'item' ? '-100%' : '0'})`}}>
        { item && <ItemPage ref={hero} isAnimating={heroAnimation}/> }
      </div>
      <div className='profile-container' style={{transform: `translateX(${page === 'profile' ? '-100%' : '0'})`}}>
        <ProfilePage/>
      </div>
    </div>
    <HeroItem isAnimating={heroAnimation} from={targetElem} to={hero.current}/>
    <Menu />
  </div>;
}

export default App
