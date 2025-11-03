import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { fetchMovies } from "@/lib/omdb"

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [greatest, setGreatest] = useState([])
  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadMovies() {
      setLoading(true)
      try {
        const trendingData = await fetchMovies("spider-man")
        const popularData = await fetchMovies("Avengers")
        const greatestData = await fetchMovies("Godfather")
        const topRatedData = await fetchMovies("Oscar")
        setTrending(trendingData)
        setPopular(popularData)
        setGreatest(greatestData)
        setTopRated(topRatedData)
      } finally {
        setLoading(false)
      }
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

  const renderMovieCard = (movie) => (
    <Card
      key={movie.imdbID}
      className="bg-card border border-border hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
      onClick={() => navigate(`/details/${movie.imdbID}`)}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"}
        alt={movie.Title}
        className="w-full h-72 object-cover rounded-t-lg"
      />
      <CardContent className="p-3">
        <h2 className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text truncate">
          {movie.Title}
        </h2>
        <p className="text-xs text-muted-foreground">{movie.Year}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to <span className="text-purple-500">Critiq.</span>
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Trending Now
        </h2>
        <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent>
            {trending.map((movie) => (
              <CarouselItem
                key={movie.imdbID}
                className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                {renderMovieCard(movie)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
          Popular
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popular.map(renderMovieCard)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
          Greatest of All Time
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {greatest.map(renderMovieCard)}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-500 to-emerald-400 text-transparent bg-clip-text">
          Top Rated
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topRated.map(renderMovieCard)}
        </div>
      </section>
    </div>
  )
}
