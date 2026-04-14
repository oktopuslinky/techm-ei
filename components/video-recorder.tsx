'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Video, Square, Pause, Play, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  maxDuration?: number
}

export function VideoRecorder({ onRecordingComplete, maxDuration = 120 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= maxDuration) {
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }, [maxDuration])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setHasPermission(true)
    } catch {
      setHasPermission(false)
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return
    
    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9',
    })
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
    }
    
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(1000)
    setIsRecording(true)
    setDuration(0)
    startTimer()
  }, [startTimer])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    setIsPaused(false)
    stopTimer()
  }, [stopTimer])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      stopTimer()
    }
  }, [stopTimer])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      startTimer()
    }
  }, [startTimer])

  const resetRecording = useCallback(() => {
    setRecordedBlob(null)
    setDuration(0)
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [])

  const confirmRecording = useCallback(() => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, duration)
    }
  }, [recordedBlob, duration, onRecordingComplete])

  useEffect(() => {
    initializeCamera()
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [initializeCamera, stopTimer])

  useEffect(() => {
    if (recordedBlob && videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.src = URL.createObjectURL(recordedBlob)
    }
  }, [recordedBlob])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-2xl">
        <Video className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          Camera access is required to record your reflection.
          <br />
          Please enable camera permissions in your browser settings.
        </p>
        <Button onClick={initializeCamera} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] bg-foreground/5 rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted={!recordedBlob}
          playsInline
          controls={!!recordedBlob}
          className="w-full h-full object-cover"
        />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            <span className="text-sm font-medium">{formatTime(duration)}</span>
          </div>
        )}
        
        {isRecording && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1 bg-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${(duration / maxDuration) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isRecording && !recordedBlob && (
          <Button
            size="lg"
            onClick={startRecording}
            className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90"
          >
            <Video className="h-6 w-6" />
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="h-14 w-14 rounded-full"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            <Button
              size="lg"
              onClick={stopRecording}
              className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90"
            >
              <Square className="h-6 w-6 fill-current" />
            </Button>
          </>
        )}

        {recordedBlob && (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={resetRecording}
              className="h-14 w-14 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={confirmRecording}
              className={cn('h-16 w-16 rounded-full bg-primary hover:bg-primary/90')}
            >
              <Check className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {!isRecording && !recordedBlob && 'Tap to start recording your reflection'}
        {isRecording && !isPaused && `Recording... ${formatTime(maxDuration - duration)} remaining`}
        {isRecording && isPaused && 'Recording paused'}
        {recordedBlob && 'Review your recording or re-record'}
      </p>
    </div>
  )
}
