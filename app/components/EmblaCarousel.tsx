import React, { useCallback, useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Image from 'next/image'


type PropType = {
  slides: any[]
  options?: EmblaOptionsType,
  strava: boolean
}

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric", 
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h12",
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, strava } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ])
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoplay = emblaApi?.plugins()?.autoplay
      if (!autoplay) return

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop

      resetOrStop()
      callback()
    },
    [emblaApi]
  )

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
    playOrStop()
  }, [emblaApi])

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    setIsPlaying(autoplay.isPlaying())
    emblaApi
      .on('autoplay:play', () => setIsPlaying(true))
      .on('autoplay:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoplay.isPlaying()))
  }, [emblaApi])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number text-center flex flex-col justify-center">
                { strava ? (
                  <div className="embla__slide__number text-center flex flex-col justify-center">
                    <p className="text-base text-zinc-300 w-full tracking-tighter">
                      {slide.name}
                    </p>
                    <p className="mt-2 text-base text-zinc-300 w-full tracking-tighter">
                      Distance: {(slide.distance * 0.000621371).toFixed(2)} miles
                    </p>
                    <p className="mt-2 text-base text-zinc-300 w-full tracking-tighter">
                      Time: {slide.elapsed_time / 60} minutes
                    </p>
                    <p className="mt-2 text-base text-zinc-300 w-full tracking-tighter">
                      Activity: {slide.sport_type}
                    </p>
                    <p className="mt-2 text-base text-zinc-300 w-full tracking-tighter">
                      Date: {new Date(slide.start_date_local).toLocaleString('en-US', dateOptions)}
                    </p>
                  </div>
                )
                : 
                (
                  <div className="embla__slide__number text-center flex flex-col justify-center">
                    <Image 
                      src={slide.src}
                      alt={slide.alt}
                      width="250"
                      height="50"
                      className="rounded-lg object-cover object-[-16px] sm:object-center"
                    />
                    <p className="mt-2 text-base text-zinc-300 w-full tracking-tighter" >{slide.title}</p>
                    <p className="text-sm text-zinc-300 w-full tracking-tighter" >{slide.purpose}</p>
                  </div>
                )
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>

        <button className="embla__play" onClick={toggleAutoplay} type="button">
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default EmblaCarousel