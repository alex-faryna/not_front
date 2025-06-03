import './App.css'
import './Embla.css'
import '@telegram-apps/telegram-ui/dist/styles.css';
import {useActiveImage, useItem, usePage} from "./state/state.ts";
import {useEffect, useRef, useState} from "react";
import {backButton, settingsButton, viewport} from "@telegram-apps/sdk-react";
import {ProfilePage} from "./pages/profile.tsx";
import {ItemPage} from "./pages/item.tsx";
import {HomePage} from "./pages/home.tsx";
import {Menu} from "./ui/menu.tsx";
import {AppRoot, Button, Modal, Placeholder, Switch, Title} from "@telegram-apps/telegram-ui";
import {
  ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Icon28Close} from "@telegram-apps/telegram-ui/dist/icons/28/close";
import {ModalClose} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose";

function HeroItem({ isAnimating, from, to }: { from: HTMLDivElement, to: HTMLDivElement }) {
  const {page} = usePage();
  const forward = page === 'item';
  const hero = useRef<HTMLDivElement>(null as HTMLImageElement);
  const { item } = useItem();
  const { activeImages } = useActiveImage();

  useEffect(() => {
    if(!to || !from) return;
    const _from = from.getBoundingClientRect();
    const _to = to.getBoundingClientRect();

    const heroElement = hero.current as HTMLImageElement;
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
      ], {duration: 500, easing: 'ease-out', fill: 'both' });
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
      ], {duration: 450, easing: 'ease-out', fill: 'both' });
    }
  }, [isAnimating]);

  if(!item) return null;

  return <img ref={hero} style={{opacity: isAnimating ? '1' : '0'}}
              className='hero-item' src={item.images[activeImages[item.id] || 0]}
              alt={`Item ${item.name}`} />;
}

function App() {
  const {page, setPage} = usePage();
  const { item, select } = useItem();
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    (async () => {

      if (viewport.mount.isAvailable()) {
        try {
          const promise = viewport.mount();
          await promise;
        } catch (err) {
          console.log(err);
        }

        if (viewport.bindCssVars.isAvailable()) {
          viewport.bindCssVars();
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (settingsButton.onClick.isAvailable()) {
      const offClick = settingsButton.onClick(() => setSettings(val => !val));
      return () => offClick();
    }
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

  const [motion, setMotion] = useState(true);

  return <AppRoot className='main'>
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

    <Modal onOpenChange={setSettings} header={<ModalHeader after={
      <Icon28Close onClick={() => setSettings(false)} style={{color: 'var(--tgui--plain_foreground)'}} />
    }></ModalHeader> as any}
      open={settings}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span>Motion</span>
          <Switch checked={motion} onChange={() => setMotion(val => !val)} />
        </div>
      </div>
    </Modal>
  </AppRoot>
}

export default App
