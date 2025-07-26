import { useState } from 'react'
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
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'neutral', label: 'Neutral' }
  ]

  const onSubmit = async (data) => {
    try {
      setSubmitMessage('')
      const formData = new FormData()
      formData.append('audio', data.audio[0])
      formData.append('artist', data.artist)
      formData.append('mood', data.mood)

      const message = await axios.post('/song', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSubmitMessage(`Music uploaded successfully! Mood: ${message.data.data.mood}`)
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
    
    // Check file extension as backup for MIME type
    const fileName = file.name.toLowerCase()
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma']
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/mp4', 'audio/x-m4a']
    
    const hasValidExtension = audioExtensions.some(ext => fileName.endsWith(ext))
    const hasValidMimeType = audioTypes.includes(file.type)
    
    // Accept if either MIME type or extension is valid
    if (!hasValidMimeType && !hasValidExtension) {
      return 'Please select a valid audio file (MP3, WAV, OGG, M4A, AAC, FLAC)'
    }
    
    // Check file size (optional - 50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return 'File size must be less than 50MB'
    }
    
    return true
  }
  
  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isUploadOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUploadOpen(false)}></div>

      {/* Modal */}
      <div className={`relative z-10 flex items-center justify-center min-h-screen p-2 xs:p-3 sm:p-4 md:p-6 transition-all duration-300 ${isUploadOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="glass rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 md:p-8 w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg animate-fadeIn">
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between mb-3 xs:mb-4 sm:mb-6 md:mb-8">
            <div className="flex-1 min-w-0 pr-2">
              <h1 className='text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2'>Upload Music</h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">Add your favorite songs with mood tags</p>
            </div>
            <button
              onClick={() => setIsUploadOpen(false)}
              className="flex-shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full glass-dark hover:bg-white/10 flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 xs:space-y-4 sm:space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>Audio File *</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
                  {...register('audio', {
                    validate: validateAudioFile
                  })}
                  className="w-full p-2.5 xs:p-3 sm:p-4 glass-dark rounded-lg sm:rounded-xl text-white text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:transition-colors file:cursor-pointer file:text-xs sm:file:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              {errors.audio && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2 flex items-start space-x-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="break-words">{errors.audio.message}</span>
                </p>
              )}
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Artist Name *</span>
                </div>
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
                className="w-full p-2.5 xs:p-3 sm:p-4 glass-dark rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                placeholder="Enter artist name"
              />
              {errors.artist && (
                <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center space-x-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.artist.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-hover w-full py-2.5 xs:py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isSubmitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Music</span>
                  </>
                )}
              </div>
            </button>

            {/* Success/Error Message */}
            {submitMessage && (
              <div className={`p-2.5 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm animate-fadeIn ${
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  {messageType === 'success' ? (
                    <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="break-words">{submitMessage}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadMusic
