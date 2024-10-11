"use client"

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useJsApiLoader, StandaloneSearchBox, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'
import { submitQuestionnaire } from './actions'
import { useToast } from "@/hooks/use-toast"

type QuestionType = 'text' | 'checkbox' | 'address'

interface Question {
  id: number
  type: QuestionType
  question: string
  options?: string[]
}

const questions: Question[] = [
  { id: 1, type: 'text', question: 'What is your name?' },
  { id: 2, type: 'checkbox', question: 'Which of the following programming languages do you know?', options: ['JavaScript', 'Python', 'Java', 'C++'] },
  { id: 3, type: 'address', question: 'What is your address?' },
]

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ""

const mapContainerStyle = {
  width: '100%',
  height: '200px'
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
}

export default function Questionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [addressInput, setAddressInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)
  const { toast } = useToast()

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value)
  }

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref
  }, [])

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces()
      if (places && places.length > 0) {
        const place = places[0]
        const address = place.formatted_address
        if (address) {
          setAddressInput(address)
          handleAnswer(questions[currentQuestionIndex].id, address)
        }
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          setMapCenter({ lat, lng })
        }
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await submitQuestionnaire(answers)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Reset the form or navigate to a thank you page
        setCurrentQuestionIndex(0)
        setAnswers({})
        setAddressInput('')
        setMapCenter(defaultCenter)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit the questionnaire. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={answers[question.id] as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here"
            className="text-lg"
          />
        )
      case 'checkbox':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox
                  id={option}
                  checked={(answers[question.id] as string[] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] as string[] || []
                    const newAnswers = checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter((a) => a !== option)
                    handleAnswer(question.id, newAnswers)
                  }}
                  className="w-6 h-6"
                />
                <Label htmlFor={option} className="text-lg">{option}</Label>
              </div>
            ))}
          </div>
        )
      case 'address':
        return (
        //   <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <div className="space-y-4">
              <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                <Autocomplete>
                    <Input
                    type="text"
                    value={addressInput}
                    onChange={handleAddressChange}
                    placeholder="Start typing your address"
                    className="text-lg"
                    />
                </Autocomplete>
              </StandaloneSearchBox>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </div>
        //   </LoadScript>
        )
      default:
        return null
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-6">{questions[currentQuestionIndex].question}</h2>
              {renderQuestion(questions[currentQuestionIndex])}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-3xl mx-auto p-4">
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between items-center">
            <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} size="lg">
              Previous
            </Button>
            <span className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}