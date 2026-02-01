import React, { useRef, useState } from "react"

export default function NewPostBox({ onPost, uploadImage }) {
  const [text, setText] = useState("")
  const [category, setCategory] = useState("general")
  const [image, setImage] = useState(null)
  const fileRef = useRef(null)

  const pickImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    setImage(url)
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="general">General</option>
        <option value="tips">Sfaturi</option>
        <option value="marketplace">Piață</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrie o postare..."
        className="w-full border rounded p-2"
      />

      <input
        type="file"
        ref={fileRef}
        hidden
        onChange={pickImage}
      />

      <div className="flex gap-2">
        <button
          onClick={() => fileRef.current.click()}
          className="border px-3 py-1 rounded"
        >
          📷 Foto
        </button>

        <button
          onClick={() => {
            onPost(text, category, image)
            setText("")
            setImage(null)
          }}
          className="bg-green-600 text-white px-4 rounded"
        >
          Postează
        </button>
      </div>
    </div>
  )
}
