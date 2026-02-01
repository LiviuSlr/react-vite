import React from "react"
import CommentInput from "./commentinput"

export default function PostCard({ post, onLike, onComment }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <div className="flex gap-3">
        <img
          src={post.avatar}
          className="w-10 h-10 rounded-full"
          alt=""
        />
        <div>
          <p className="font-semibold">{post.username}</p>
          <p className="text-xs text-gray-500">
            {post.createdAt.toLocaleString()}
          </p>
        </div>
      </div>

      <p>{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          className="rounded-lg max-h-80 object-cover"
          alt=""
        />
      )}

      <div className="flex gap-4 text-sm">
        <button
          onClick={() => onLike(post.id)}
          className={`font-medium ${
            post.likedByMe ? "text-red-500" : ""
          }`}
        >
          ❤️ {post.likes}
        </button>
        <span>💬 {post.comments.length}</span>
      </div>

      {post.comments.map((c, i) => (
        <p key={i} className="text-sm text-gray-600">
          {c}
        </p>
      ))}

      <CommentInput onSubmit={(t) => onComment(post.id, t)} />
    </div>
  )
}
