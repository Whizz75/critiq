import { Film, Star, UsersRound } from "lucide-react"

export default function About() {
  return (
    <div className="max-w-4xl mx-auto mt-16 px-6 text-center text-gray-300">
      <h1 className="text-4xl font-extrabold mb-6 text-purple-600">About Critiq</h1>

      <p className="mb-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
        <strong>Critiq</strong> is your ultimate movie companion. Discover new films, rate your favorites, and share your thoughts with a community of passionate movie lovers. Powered by data from the OMDb API, Critiq brings the world of cinema right to your fingertips.
      </p>

      <p className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
        Whether you're hunting for hidden gems, checking reviews before a night at the cinema, or simply sharing your opinion, Critiq makes movie reviewing easy, fun, and interactive.
      </p>

      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-4">
            <Film className="inline-block mr-2 text-green-400" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Discover Movies</h3>
          <p className="text-gray-400">
            Explore thousands of movies from the OMDb database. Find classics, new releases, and hidden gems tailored to your tastes.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-4">
            <Star className="inline-block mr-2 text-yellow-400" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Rate & Review</h3>
          <p className="text-gray-400">
            Share your opinions and rate films you’ve watched. Help the community discover which movies are worth their time.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-4">
            <UsersRound className="inline-block mr-2 text-blue-400" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Engage with Community</h3>
          <p className="text-gray-400">
            Connect with other movie enthusiasts, read reviews, and see what’s trending in the world of cinema.
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Built with <strong>React</strong>, <strong>Node.js</strong>, <strong>Firebase</strong>, and <strong>Shadcn UI</strong>. Designed and developed by 
        <span className="text-purple-400 font-semibold">
          <a href="https://github.com/Whizz75"> Harry Ntsekhe </a>
        </span>
        for <em>the Faculty of ICT at <strong>Limkokwing University of Creative Technology</strong></em>.
      </p>
    </div>
  )
}
