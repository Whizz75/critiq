import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Edit, Trash2, Save, X, Sparkles } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const { user, logout } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editText, setEditText] = useState("")
  const [editRating, setEditRating] = useState(0)

  useEffect(() => {
    if (!user) return
    async function loadUserReviews() {
      const q = query(
        collection(db, "reviews"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      const fetchedReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReviews(fetchedReviews)
      setLoading(false)
    }
    loadUserReviews()
  }, [user])

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Please log in to view your profile.
      </div>
    )
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const startEditing = (review) => {
    setEditingReviewId(review.id)
    setEditText(review.text)
    setEditRating(review.rating)
  }

  const cancelEditing = () => {
    setEditingReviewId(null)
    setEditText("")
    setEditRating(0)
  }

  const saveEdit = async () => {
    if (!editText || editRating === 0) return
    const reviewRef = doc(db, "reviews", editingReviewId)
    await updateDoc(reviewRef, {
      text: editText,
      rating: editRating,
      updatedAt: serverTimestamp(),
    })
    cancelEditing()
    refreshReviews()
  }

  const refreshReviews = async () => {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)
    setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    await deleteDoc(doc(db, "reviews", reviewId))
    setReviews((prev) => prev.filter((r) => r.id !== reviewId))
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative bg-gradient-to-br from-[#1e1b4b]/70 to-[#3b0764]/70 border border-purple-600/30 backdrop-blur-xl shadow-xl p-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-pink-700/10 blur-2xl rounded-2xl" />
          <CardContent className="relative z-10">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-28 h-28 rounded-full mx-auto mb-4 ring-4 ring-purple-500/40"
            />
            <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              {user.displayName}
            </h2>
            <p className="text-sm text-gray-300 mb-4">{user.email}</p>

            <div className="flex justify-center items-center gap-2 text-yellow-400 font-semibold mb-4">
              <Star className="w-5 h-5 fill-yellow-400" />
              Average Rating: {averageRating} / 5
            </div>

            <Button
              onClick={logout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-6 flex items-center gap-2">
          <Sparkles className="text-purple-400" /> Your Reviews
        </h3>

        {loading ? (
          <p className="text-gray-400 text-center">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-gray-900/30 rounded-2xl border border-purple-900/20 backdrop-blur-sm">
            <p className="text-lg mb-3">You haven’t posted any reviews yet.</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-transform"
            >
              Start Reviewing
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col gap-4">
              {reviews.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-900/60 border border-purple-800/30 rounded-xl shadow-lg hover:shadow-purple-900/30 p-4 backdrop-blur-md transition-transform hover:scale-[1.01]">
                    <div className="flex justify-between items-center mb-3">
                      <p
                        className="font-semibold text-lg text-white cursor-pointer hover:text-purple-400 transition"
                        onClick={() => navigate(`/details/${r.movieId}`)}
                      >
                        🎬 {r.movieTitle || "Movie"}
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 transition-all ${
                              r.rating >= s
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                        {editingReviewId === r.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={saveEdit}
                              className="border-green-500/50 hover:bg-green-600/20"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              className="border-red-500/50 hover:bg-red-600/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(r)}
                              className="border-purple-400/50 hover:bg-purple-600/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteReview(r.id)}
                              className="border-red-400/50 hover:bg-red-600/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {editingReviewId === r.id ? (
                      <div className="mt-3">
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer transition-all ${
                                editRating >= star
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                              onClick={() => setEditRating(star)}
                            />
                          ))}
                        </div>
                        <textarea
                          className="w-full p-3 rounded-md bg-gray-800 text-white border border-purple-700/50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {r.text}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
