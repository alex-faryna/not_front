import {useActiveImage} from "../state/state.ts";
import {useCallback, useEffect, useMemo} from "react";
import useEmblaCarousel from "embla-carousel-react";

export function Carousel({ ref, id, slides, options, children }) {
  const { activeImages, setActiveImage } = useActiveImage();
  const selectedIndex = useMemo(() => Math.max(0, Math.min(activeImages[id] || 0, slides.length)), [id, activeImages]);
  const setSelectedIndex = useCallback((index: number) => setActiveImage(id, index), [id, setActiveImage]);

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ ...options, loop: true })

  useEffect(() => {
    if (!emblaMainApi || selectedIndex === emblaMainApi.selectedScrollSnap()) return;
    emblaMainApi.scrollTo(selectedIndex)
  }, [emblaMainApi, selectedIndex]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect();

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={rf => {
        ref.current = rf;
        emblaMainRef!(rf);
      }}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{ children(index, true) }</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
