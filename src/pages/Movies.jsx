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
  const [debounceTimer, setDebounceTimer] = useState(null)
  const navigate = useNavigate()

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
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300 bg-gradient-to-br from-background to-muted text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.25),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,28,135,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.25),transparent_60%)]" />
      </div>

      <div className="relative z-10 px-6 py-12">
        <h1 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(147,51,234,0.25)]">
          Discover Movies ✨
        </h1>

        <div className="max-w-xl mx-auto flex gap-2 mb-14">
          <input
            type="text"
            placeholder="Search for a movie..."
            className="flex-1 p-3 rounded-xl border border-border bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-900 dark:from-indigo-900/60 dark:to-purple-900/60 dark:text-white placeholder-gray-400 dark:placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-[0_0_10px_rgba(147,51,234,0.15)] dark:shadow-[0_0_20px_rgba(147,51,234,0.25)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Search Results
              </h2>

              <div className="relative">
                <div className="flex overflow-x-auto gap-6 scrollbar-hide pb-4">
                  {movies.map((movie) => (
                    <div
                      key={movie.imdbID}
                      className="min-w-[200px] flex-shrink-0 group cursor-pointer relative"
                      onClick={() => navigate(`/details/${movie.imdbID}`)}
                    >
                      <Card className="bg-white/80 dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-gray-800/90 border border-border rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all duration-300 overflow-hidden">
                        <img
                          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"}
                          alt={movie.Title}
                          className="w-[200px] h-[300px] object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <CardContent className="p-3">
                          <h3 className="text-base font-semibold truncate bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                            {movie.Title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-indigo-300/70">{movie.Year}</p>
                        </CardContent>
                      </Card>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end rounded-2xl p-4">
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && movies.length === 0 && query.trim() !== "" && (
          <p className="text-center text-gray-500 dark:text-indigo-300/60 mt-10 text-lg">
            No movies found for "<span className="text-purple-500">{query}</span>".
          </p>
        )}

        {!loading && !query.trim() && (
          <p className="text-center text-gray-600 dark:text-indigo-400/60 text-lg mt-20">
            Search for your next cinematic obsession 🎥
          </p>
        )}
      </div>
    </div>
  )
}
