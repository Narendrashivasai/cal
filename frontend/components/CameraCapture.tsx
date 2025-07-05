'use client'

import React, { useState, useRef, useCallback } from 'react'
import { 
  CameraIcon, 
  PhotoIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  CheckIcon 
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { analyzeMealImage } from '@/services/foodRecognition'
import { FoodRecognitionResponse } from '@/types'
import toast from 'react-hot-toast'

export function CameraCapture() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<FoodRecognitionResponse | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Camera access denied. Please enable camera permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  })

  const analyzeMeal = async () => {
    if (!capturedImage) return
    
    setAnalyzing(true)
    try {
      const result = await analyzeMealImage(capturedImage)
      setAnalysisResult(result)
      toast.success('Meal analyzed successfully!')
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Failed to analyze meal. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setAnalysisResult(null)
    stopCamera()
  }

  if (analysisResult) {
    return <MealAnalysisResult result={analysisResult} onReset={resetCapture} />
  }

  if (capturedImage) {
    return (
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Review Your Meal Photo
          </h3>
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured meal" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={resetCapture}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={resetCapture}
            className="flex-1 btn btn-outline"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Retake
          </button>
          <button
            onClick={analyzeMeal}
            disabled={analyzing}
            className="flex-1 btn btn-primary"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Analyze Meal
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  if (isCapturing) {
    return (
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Capture Your Meal
          </h3>
          <div className="relative camera-container h-64">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-4">
              <div className="flex space-x-4">
                <button
                  onClick={stopCamera}
                  className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={capturePhoto}
                  className="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-lg"
                >
                  <CameraIcon className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Capture or Upload Your Meal
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={startCamera}
            className="w-full btn btn-primary py-4"
          >
            <CameraIcon className="h-6 w-6 mr-2" />
            Take Photo
          </button>
          
          <div className="text-sm text-gray-500">or</div>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              {isDragActive 
                ? 'Drop the image here...' 
                : 'Drag & drop an image here, or click to select'
              }
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPEG, PNG, WebP
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MealAnalysisResult({ 
  result, 
  onReset 
}: { 
  result: FoodRecognitionResponse, 
  onReset: () => void 
}) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Meal Analysis Results
        </h3>
        <button
          onClick={onReset}
          className="btn btn-outline"
        >
          Analyze Another
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {result.foods.length} food items detected
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        </div>
        
        <div className="space-y-3">
          {result.foods.map((food, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{food.name}</div>
                <div className="text-sm text-gray-600">
                  Confidence: {Math.round(food.confidence * 100)}%
                </div>
              </div>
              {food.quantity && (
                <div className="text-sm text-gray-600">
                  ~{food.quantity.estimated} {food.quantity.unit}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button className="w-full btn btn-primary">
          Get Nutrition Details
        </button>
      </div>
    </div>
  )
}