import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from '../utils/API'

const UploadMusic = ({ isUploadOpen, setIsUploadOpen }) => {
  const [submitMessage, setSubmitMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const moodOptions = [
    { value: '', label: 'Select a mood' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm', label: 'Calm' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'angry', label: 'Angry' },
    { value: 'nostalgic', label: 'Nostalgic' }
  ]

  const onSubmit = async (data) => {
    try {
      setSubmitMessage('')
      const formData = new FormData()
      formData.append('audio', data.audio[0])
      formData.append('artist', data.artist)
      formData.append('mood', data.mood)

      const response = await axios.post('/song', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSubmitMessage('Music uploaded successfully!')
      setMessageType('success')
      reset()
    } catch (error) {
      setSubmitMessage(error.response?.data?.message || 'Upload failed. Please try again.')
      setMessageType('error')
    }
  }

  const validateAudioFile = (files) => {
    if (!files || files.length === 0) {
      return 'Audio file is required'
    }
    
    const file = files[0]
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a']
    
    if (!audioTypes.includes(file.type)) {
      return 'Please select a valid audio file (MP3, WAV, OGG, M4A)'
    }
    
    return true
  }
  
  return (
    <div className={`p-6 w-screen h-screen mx-auto fixed top-0 left-0 bg-black ${isUploadOpen ? 'block' : 'hidden'}`}>
      <h1 className='text-2xl text-center font-bold text-white mb-6'>Upload Music</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        {/* File Upload */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Audio File *
          </label>
          <input
            type="file"
            accept="audio/*"
            {...register('audio', {
              validate: validateAudioFile
            })}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {errors.audio && (
            <p className="text-red-400 text-sm mt-1">{errors.audio.message}</p>
          )}
        </div>

        {/* Artist Name */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Artist Name *
          </label>
          <input
            type="text"
            {...register('artist', {
              required: 'Artist name is required',
              minLength: {
                value: 2,
                message: 'Artist name must be at least 2 characters'
              }
            })}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter artist name"
          />
          {errors.artist && (
            <p className="text-red-400 text-sm mt-1">{errors.artist.message}</p>
          )}
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Mood *
          </label>
          <select
            {...register('mood', {
              required: 'Please select a mood'
            })}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
          >
            {moodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.mood && (
            <p className="text-red-400 text-sm mt-1">{errors.mood.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Music'}
        </button>

        {/* Success/Error Message */}
        {submitMessage && (
          <div className={`p-3 rounded text-center ${
            messageType === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  )
}

export default UploadMusic
