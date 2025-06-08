import {useCallback, useEffect, useMemo, useRef} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {useActiveImage} from "../state/state.ts";

function Thumb({ selected, index, onClick, children }) {
  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        { children(index, false) }
      </button>
    </div>
  )
}

// TODO export id upwards
export function ItemCarousel({ ref, id, slides, options, children }) {
  const { activeImages, setActiveImage } = useActiveImage();
  // TODO: use %
  const selectedIndex = useMemo(() => Math.max(0, Math.min(activeImages[id] || 0, slides.length)), [id, activeImages]);
  const setSelectedIndex = useCallback((index: number) => setActiveImage(id, index), [id, setActiveImage]);

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ ...options, loop: true })
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const once = useRef(true);
  useEffect(() => {
    if (emblaMainApi && emblaThumbsApi && activeImages[id] && once.current) {
      once.current = false;
      onThumbClick(activeImages[id], true);
    }
  }, [emblaMainApi, emblaThumbsApi]);

  const onThumbClick = useCallback(
    (index: number, jump = false) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index, jump);
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

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

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((image) => (
              <Thumb
                key={image}
                onClick={() => onThumbClick(image)}
                selected={image === selectedIndex}
                index={image}
              >
                { children }
              </Thumb>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
