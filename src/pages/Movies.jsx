import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchMovies } from "@/lib/omdb"
import { Loader2 } from "lucide-react"

export default function Movies() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [debounceTimer, setDebounceTimer] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      return
    }

    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchMovies(query)
        setMovies(data)
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }, 500)

    setDebounceTimer(timer)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Search Movies
      </h1>

      <div className="max-w-xl mx-auto flex gap-2 mb-10">
        <input
          type="text"
          placeholder="Enter movie title..."
          className="flex-1 p-2 rounded-md bg-gray-800 text-white border border-border"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && movies.length > 0 && (
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
      )}

      {!loading && movies.length === 0 && query.trim() !== "" && (
        <p className="text-center text-gray-400 mt-10">
          No movies found for "{query}".
        </p>
      )}
    </div>
  )
}
