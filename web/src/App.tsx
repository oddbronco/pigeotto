import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { Map } from './components/Map'
import { supabase } from './lib/supabase'
import './App.css'

interface PredictionResult {
  latitude: number
  longitude: number
  confidence: number
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (file: File, previewUrl: string) => {
    setSelectedImage(previewUrl)
    setSelectedFile(file)
    setPrediction(null)
    setError(null)
  }

  const handlePredict = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const result = await response.json()

      setPrediction({
        latitude: result.latitude,
        longitude: result.longitude,
        confidence: result.confidence
      })

      await supabase.from('predictions').insert({
        image_url: selectedFile.name,
        predicted_lat: result.latitude,
        predicted_lng: result.longitude,
        confidence: result.confidence
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setPrediction(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>PIGEON</h1>
        <p>Predicting Image Geolocations</p>
      </header>

      <main className="main">
        <div className="content">
          {!selectedImage ? (
            <ImageUpload onImageSelect={handleImageSelect} />
          ) : (
            <div className="result-container">
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" />
                <button onClick={handleReset} className="reset-btn">
                  Upload New Image
                </button>
              </div>

              {!prediction && (
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="predict-btn"
                >
                  {loading ? 'Analyzing...' : 'Predict Location'}
                </button>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {prediction && (
                <div className="prediction-results">
                  <h2>Predicted Location</h2>
                  <div className="coordinates">
                    <div className="coord">
                      <span className="label">Latitude:</span>
                      <span className="value">{prediction.latitude.toFixed(6)}</span>
                    </div>
                    <div className="coord">
                      <span className="label">Longitude:</span>
                      <span className="value">{prediction.longitude.toFixed(6)}</span>
                    </div>
                    {prediction.confidence > 0 && (
                      <div className="coord">
                        <span className="label">Confidence:</span>
                        <span className="value">{(prediction.confidence * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <Map
                    latitude={prediction.latitude}
                    longitude={prediction.longitude}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
