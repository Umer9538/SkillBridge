import { useState, useRef } from 'react'
import { Upload, X, File, Image, Video, FileText, Check, Loader } from 'lucide-react'
import api from '../../utils/api'

const FileUpload = ({
  onUploadSuccess,
  onUploadError,
  uploadType = 'general', // profile-picture, course-thumbnail, course-document, course-video, task-attachment, submission
  accept = '*/*',
  maxSize = 5, // in MB
  label = 'Upload File',
  showPreview = true,
  currentFile = null
}) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(currentFile)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const getFileIcon = (fileName) => {
    if (!fileName) return <File size={40} />

    const ext = fileName.split('.').pop().toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <Image size={40} />
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
      return <Video size={40} />
    } else if (['pdf', 'doc', 'docx'].includes(ext)) {
      return <FileText size={40} />
    } else {
      return <File size={40} />
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setError(null)
    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith('image/') && showPreview) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const endpoint = `/upload/${uploadType}`

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(progress)
        }
      })

      setUploadProgress(100)

      if (onUploadSuccess) {
        onUploadSuccess(response.data)
      }

      // Reset file input but keep preview
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to upload file'
      setError(errorMessage)

      if (onUploadError) {
        onUploadError(errorMessage)
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {/* Upload Area */}
      {!file && !preview && (
        <div
          onClick={handleBrowseClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors"
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
          <p className="text-xs text-gray-500">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      )}

      {/* Preview Area */}
      {(file || preview) && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {preview && preview.startsWith('data:image') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
              ) : preview && preview.startsWith('/uploads') ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${preview}`}
                  alt="Current file"
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  {getFileIcon(file?.name || preview)}
                </div>
              )}

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {file?.name || 'Current file'}
                </p>
                {file && (
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Uploading...</span>
                <span className="text-xs text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {file && !uploading && (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Upload
              </button>
              <button
                onClick={handleBrowseClick}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
          )}

          {!file && preview && (
            <button
              onClick={handleBrowseClick}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Change File
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
