'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [gender, setGender] = useState('any')
  const [pose, setPose] = useState('portrait')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const styles = [
    { value: 'realistic', label: 'Realistis' },
    { value: 'watercolor', label: 'Cat Air' },
    { value: 'oil-painting', label: 'Lukisan Minyak' },
    { value: 'sketch', label: 'Sketsa Pensil' },
    { value: 'anime', label: 'Anime' },
    { value: 'portrait', label: 'Potret Klasik' },
    { value: 'abstract', label: 'Abstrak Modern' },
    { value: 'impressionist', label: 'Impresionis' },
  ]

  const genderOptions = [
    { value: 'any', label: 'Acak' },
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
  ]

  const poseOptions = [
    { value: 'portrait', label: 'Potret Wajah' },
    { value: 'full-body', label: 'Seluruh Tubuh' },
    { value: 'sitting', label: 'Duduk' },
    { value: 'standing', label: 'Berdiri' },
    { value: 'walking', label: 'Berjalan' },
    { value: 'dancing', label: 'Menari' },
  ]

  const generateImage = async () => {
    if (!prompt.trim() && style === 'realistic') {
      setMessage('Silakan masukkan deskripsi atau pilih gaya')
      return
    }

    setLoading(true)
    setMessage('')
    setImageUrl('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          gender,
          pose,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setImageUrl(data.imageUrl)
        setMessage('Gambar berhasil dibuat!')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat membuat gambar')
    } finally {
      setLoading(false)
    }
  }

  const uploadToInstagram = async () => {
    if (!imageUrl) {
      setMessage('Tidak ada gambar untuk diunggah')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const caption = prompt || `Seni manusia - Gaya: ${style}`

      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          caption,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Berhasil diunggah ke Instagram!')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengunggah ke Instagram')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-3 text-purple-900">
          🎨 Generator Seni Manusia
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Buat gambar artistik manusia dengan AI dan unggah langsung ke Instagram
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Pengaturan</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Tambahan (Opsional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Contoh: seorang wanita tua dengan senyum hangat, pencahayaan lembut..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gaya Seni
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {styles.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {genderOptions.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pose
                </label>
                <select
                  value={pose}
                  onChange={(e) => setPose(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {poseOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateImage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? '🎨 Sedang membuat...' : '🎨 Buat Gambar'}
              </button>

              {imageUrl && (
                <button
                  onClick={uploadToInstagram}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-pink-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {uploading ? '📤 Mengunggah...' : '📤 Unggah ke Instagram'}
                </button>
              )}

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('Error') || message.includes('kesalahan')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Preview</h2>

            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Membuat karya seni...</p>
                </div>
              ) : imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt="Generated artwork"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Gambar akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📋 Petunjuk Penggunaan</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Pilih gaya seni, jenis kelamin, dan pose yang diinginkan</li>
            <li>Tambahkan deskripsi detail (opsional) untuk hasil yang lebih spesifik</li>
            <li>Klik "Buat Gambar" dan tunggu AI membuat karya seni</li>
            <li>Setelah gambar dibuat, klik "Unggah ke Instagram" untuk memposting</li>
            <li>Pastikan Anda sudah mengkonfigurasi API key di file .env</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
