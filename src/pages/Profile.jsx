import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Edit, Trash2, Save, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
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
      const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReviews(fetchedReviews)
      setLoading(false)
    }
    loadUserReviews()
  }, [user])

  if (!user) {
    return <div className="text-center mt-20 text-gray-400">Please log in to view your profile.</div>
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
      updatedAt: serverTimestamp()
    })
    cancelEditing()
    setLoading(true)
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)
    const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setReviews(fetchedReviews)
    setLoading(false)
  }

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    await deleteDoc(doc(db, "reviews", reviewId))
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card className="bg-card border border-border p-6 text-center mb-6">
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <CardContent>
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">{user.displayName}</h2>
          <p className="bg-gradient-to-r from-blue-700 to-indigo-400 text-transparent bg-clip-text mb-2">{user.email}</p>
          <p className="text-yellow-400 font-semibold mb-4 flex justify-center items-center gap-1">
            <Star className="w-4 h-4" /> Average Rating: {averageRating} / 5
          </p>
          <Button
            onClick={logout}
            className="bg-indigo-400 hover:bg-primary text-slate-800"
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold text-white mb-4">Your Reviews</h3>

      {loading ? (
        <p className="text-gray-400 text-center">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-center">You haven’t posted any reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <Card key={r.id} className="bg-card border border-border p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-white cursor-pointer" onClick={() => navigate(`/details/${r.movieId}`)}>
                  {r.movieTitle || "Movie"}
                </p>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${r.rating >= s ? "text-yellow-400" : "text-gray-500"}`} />
                  ))}
                  {editingReviewId === r.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={saveEdit}><Save className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}><X className="w-4 h-4" /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEditing(r)}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => deleteReview(r.id)}><Trash2 className="w-4 h-4" /></Button>
                    </>
                  )}
                </div>
              </div>

              {editingReviewId === r.id ? (
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${editRating >= star ? "text-yellow-400" : "text-gray-500"}`}
                        onClick={() => setEditRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full p-2 rounded-md bg-gray-800 text-white border border-border mb-2"
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-gray-300">{r.text}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
