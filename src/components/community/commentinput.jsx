import React, { useState } from "react"

export default function CommentInput({ onSubmit }) {
  const [text, setText] = useState("")

  const send = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
    setText("")
  }

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrie un comentariu..."
        className="flex-1 border rounded px-3 py-1 text-sm"
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button
        onClick={send}
        className="bg-green-600 text-white px-3 rounded"
      >
        Trimite
      </button>
    </div>
  )
}
