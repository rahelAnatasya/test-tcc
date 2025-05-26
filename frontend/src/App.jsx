import { useState } from 'react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [message, setMessage] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
    setMessage('') // Clear previous messages
    setUploadedImageUrl('') // Clear previous image
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedFile) {
      setMessage('Please select a file first.')
      return
    }

    const formData = new FormData()
    formData.append('imageFile', selectedFile)

    setMessage('Uploading...')

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        // Headers are not strictly necessary for FormData with fetch,
        // but if you encounter issues, you might need:
        // headers: { 'Content-Type': 'multipart/form-data' } // This is often set automatically by the browser for FormData
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`Success: ${result.message}`)
        // Assuming the backend is running on localhost:5000 and serves uploads from there
        setUploadedImageUrl(`http://localhost:5000${result.filePath}`)
      } else {
        setMessage(`Error: ${result.message || 'Upload failed'}`)
        setUploadedImageUrl('')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage('Upload failed. See console for details.')
      setUploadedImageUrl('')
    }
  }

  return (
    <>
      <div className="App">
        <h1>File Upload</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <button type="submit">Upload Image</button>
        </form>
        {message && <p className="message">{message}</p>}
        {uploadedImageUrl && (
          <div className="image-preview">
            <h2>Uploaded Image:</h2>
            <img
              src={uploadedImageUrl}
              alt="Uploaded content"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default App
