'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { Button } from "@/components/ui/button"

const useCarousel = (images: string[], prefetchCount: number = 2) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [images.length])

  const prefetchedImages = images
    .slice(currentIndex + 1, currentIndex + 1 + prefetchCount)
    .concat(images.slice(0, prefetchCount - (images.length - currentIndex - 1)))

  return { currentIndex, goToNext, goToPrevious, prefetchedImages, direction, setDirection }
}

interface CarouselProps {
  images?: string[]
  height?: number
  width?: number
}

export default function ImageCarousel({ images = [], height = 400, width = 600 }: CarouselProps) {
  const { currentIndex, goToNext, goToPrevious, prefetchedImages, direction, setDirection } = useCarousel(images)

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  const dragHandlers = {
    onDragEnd: (e: any, info: PanInfo) => {
      const threshold = 50
      if (info.offset.x < -threshold) {
        goToNext()
      } else if (info.offset.x > threshold) {
        goToPrevious()
      }
    },
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  if (!images || images.length === 0) {
    return (
      <div style={{ width, height }} className="bg-gray-200 flex flex-col items-center justify-center">
        <ImageOff className="w-16 h-16 text-gray-400" />
        <p className="text-gray-500 mt-4">No images available</p>
      </div>
    )
  }

  return (
    <div style={{ width, height }} className="relative">
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
            animate="visible"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            {...dragHandlers}
            className="absolute w-full h-full"
          >
            <Image
              src={`/${images[currentIndex]}`}
              alt={`Image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={currentIndex === 0}
              sizes={`${width}px`}
            />
          </motion.div>
        </AnimatePresence>
        {prefetchedImages.map((src, index) => (
          <Image
            key={`prefetch-${index}`}
            src={`/${src}`}
            alt={`Prefetched Image ${index + 1}`}
            width={1}
            height={1}
            className="sr-only"
          />
        ))}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
        onClick={() => { setDirection(-1); goToPrevious(); }}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
        onClick={() => { setDirection(1); goToNext(); }}
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}