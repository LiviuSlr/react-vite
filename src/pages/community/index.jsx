import React, { useEffect, useMemo, useState } from "react"
import {
  getAllPosts,
  writePost,
  writeComment,
  addLike,
  removeLike,
  uploadImage,
} from "@/lib/appwrite"

import PostCard from "../../components/community/postcard"
import NewPostBox from "../../components/community/newpostbox"
import CategoryFilter from "../../components/community/categoryfilter"

/* ---------- helpers ---------- */

const safeIdnp = () => {
  try {
    return localStorage.getItem("idnp") || "anon"
  } catch {
    return "anon"
  }
}

const commentsToArray = (c) => (Array.isArray(c) ? c : [])

const mapDbPostToUi = (p) => {
  const likes = Array.isArray(p.likes_idnp) ? p.likes_idnp : []
  return {
    id: p.$id,
    content: p.message || "",
    username: p.profile_name || "Utilizator",
    avatar: p.profile_picture || "/placeholder.svg",
    category: p.type || "general",
    createdAt: new Date(p.date_created || p.$createdAt || 0),
    image: p.image_url || null,
    likes: likes.length,
    likedByMe: likes.includes(safeIdnp()),
    comments: commentsToArray(p.comments),
  }
}

export default function Community() {
  const [postsById, setPostsById] = useState({})
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  /* ---------- load posts ---------- */

  useEffect(() => {
    async function load() {
      const res = await getAllPosts()
      const rows = Array.isArray(res) ? res : res?.rows || []
      const map = {}
      rows.forEach((p) => (map[p.$id] = p))
      setPostsById(map)
      setLoading(false)
    }
    load()
  }, [])

  const posts = useMemo(() => {
    return Object.values(postsById)
      .map(mapDbPostToUi)
      .filter((p) => category === "all" || p.category === category)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [postsById, category])

  /* ---------- actions ---------- */

  const handleLike = async (postId) => {
    const post = postsById[postId]
    if (!post) return

    const me = safeIdnp()
    const likes = Array.isArray(post.likes_idnp) ? post.likes_idnp : []
    const already = likes.includes(me)

    const updated = {
      ...post,
      likes_idnp: already
        ? likes.filter((x) => x !== me)
        : [...likes, me],
    }

    setPostsById((p) => ({ ...p, [postId]: updated }))

    try {
      already ? await removeLike(post) : await addLike(post, me)
    } catch {
      setPostsById((p) => ({ ...p, [postId]: post }))
    }
  }

  const handleComment = async (postId, text) => {
    const post = postsById[postId]
    if (!post) return

    const updated = {
      ...post,
      comments: [...commentsToArray(post.comments), text],
    }

    setPostsById((p) => ({ ...p, [postId]: updated }))

    try {
      await writeComment(post, text)
    } catch {
      setPostsById((p) => ({ ...p, [postId]: post }))
    }
  }

  const handleCreatePost = async (text, category, imageUrl) => {
    const id = crypto.randomUUID()

    const post = {
      $id: id,
      message: text,
      type: category,
      profile_name: "Utilizator",
      profile_picture: "/placeholder.svg",
      date_created: new Date().toISOString(),
      likes_idnp: [],
      comments: [],
      image_url: imageUrl || "",
    }

    setPostsById((p) => ({ ...p, [id]: post }))
    await writePost(post)
  }

  /* ---------- render ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <CategoryFilter value={category} onChange={setCategory} />

        <NewPostBox onPost={handleCreatePost} uploadImage={uploadImage} />

        {loading && <p className="text-center text-gray-500">Se încarcă…</p>}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  )
}

