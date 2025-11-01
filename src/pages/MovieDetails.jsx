import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchMovieDetails } from "@/lib/omdb"
import { useAuth } from "@/context/AuthContext"
import { Loader2, Star, Clock, Globe, Trophy, Edit, Trash2, Save, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore"

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(0)
  const [posting, setPosting] = useState(false)

  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editText, setEditText] = useState("")
  const [editRating, setEditRating] = useState(0)

  useEffect(() => {
    async function loadDetails() {
      const data = await fetchMovieDetails(id)
      setMovie(data)
      setLoading(false)
    }
    loadDetails()
  }, [id])

  useEffect(() => {
    async function loadReviews() {
      const q = query(
        collection(db, "reviews"),
        where("movieId", "==", id),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReviews(fetchedReviews)
    }
    loadReviews()
  }, [id, posting])

  const handleReviewSubmit = async () => {
    if (!reviewText || reviewRating === 0) return
    setPosting(true)
    await addDoc(collection(db, "reviews"), {
      movieId: id,
      movieTitle: movie.Title,
      userId: user.uid,
      userName: user.displayName,
      text: reviewText,
      rating: reviewRating,
      createdAt: serverTimestamp()
    })
    setReviewText("")
    setReviewRating(0)
    setPosting(false)
  }

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
    setPosting(!posting)
  }

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    await deleteDoc(doc(db, "reviews", reviewId))
    setPosting(!posting)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!movie) return <p className="text-center mt-10 text-gray-400">Movie details not found.</p>

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <Card className="bg-card border border-border shadow-lg">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"}
            alt={movie.Title}
            className="rounded-lg w-full h-auto object-cover shadow-md"
          />
          <CardContent className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-3">{movie.Title}</h1>
              <p className="text-sm bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-4">{movie.Year} • {movie.Genre} • {movie.Runtime}</p>
              <div className="flex flex-wrap gap-4 mb-4 bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
                {movie.imdbRating && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {movie.imdbRating}/10 IMDb</span>}
                {movie.Language && <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {movie.Language}</span>}
                {movie.Awards && <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-300" /> {movie.Awards}</span>}
                {movie.Runtime && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.Runtime}</span>}
              </div>
              <p className="bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text mb-4">{movie.Plot}</p>
              <p className="text-sm bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-1"><strong>Director:</strong> {movie.Director}</p>
              <p className="text-sm bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text mb-4"><strong>Actors:</strong> {movie.Actors}</p>
            </div>

            {user && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Add Your Review</h3>
                <div className="flex items-center mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${reviewRating >= star ? "text-yellow-400" : "text-gray-500"}`}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-border mb-2"
                  rows={3}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <Button
                  className="bg-primary text-primary-foreground hover:opacity-90 w-full"
                  onClick={handleReviewSubmit}
                  disabled={posting || reviewRating === 0 || !reviewText}
                >
                  {posting ? "Posting..." : "Submit Review"}
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-500">Reviews</h2>
        {reviews.length === 0 && <p className="text-gray-400">No reviews yet. Be the first to review!</p>}
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <Card key={r.id} className="bg-card border border-border p-4">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">{r.userName || "Anonymous"}</p>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${r.rating >= s ? "text-yellow-400" : "text-gray-500"}`}
                    />
                  ))}
                  {user && r.userId === user.uid && (
                    <div className="flex gap-2 ml-2">
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
                <p className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">{r.text}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
