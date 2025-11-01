import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchMovies } from "@/lib/omdb"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadMovies() {
      const data = await fetchMovies("Interstellar")
      setMovies(data)
      setLoading(false)
    }
    loadMovies()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to <span className="text-purple-500">Critiq.</span>
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <Card
            key={movie.imdbID}
            className="bg-card border border-border hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"}
              alt={movie.Title}
              className="w-full h-80 object-cover rounded-t-lg"
            />
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text truncate">{movie.Title}</h2>
              <p className="text-sm bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">{movie.Year}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-sm border-border hover:bg-gradient-to-r from-indigo-500 to-purple-600 hover:text-white"
                onClick={() => navigate(`/details/${movie.imdbID}`)}
              >
                Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
