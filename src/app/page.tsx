import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#0d1117] via-[#1b1f24] to-[#2a2f36] text-gray-100">
      <main className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-8">
        {/* Left content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Create{" "}
            <span className="text-orange-500 drop-shadow-[0_0_10px_#ff7a18]">
              Live Quizzes
            </span>{" "}
            That Engage & Excite
          </h1>

          <p className="text-gray-300 text-lg mb-10">
            Transform your presentations into interactive experiences. Host live
            quizzes, get real-time responses, and make learning fun for
            everyone.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link
              href="/signup"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-200 hover:shadow-orange-500/40"
            >
              Get Started as Host
            </Link>

            <Link
              href="/login"
              className="border border-orange-400 hover:border-orange-500 text-orange-400 hover:text-orange-300 font-semibold py-3 px-8 rounded-full transition-all duration-200"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right-side video */}
        <div className="flex-shrink-0 z-10 relative group">
          {/* Glowing blur border */}
          <div className="absolute inset-0 rounded-2xl bg-orange-500/40 blur-2xl opacity-60 group-hover:opacity-90 transition duration-300"></div>

          {/* Clickable embedded video */}
          <Link
            href="https://www.youtube.com/watch?v=uJVniFV0Jnw"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden shadow-lg border border-orange-500/30 relative"
          >
            <iframe
              src="https://www.youtube.com/embed/uJVniFV0Jnw?autoplay=1&mute=1&loop=1&playlist=uJVniFV0Jnw"
              title="Demo Video"
              height={280}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl w-full aspect-video"
            />
          </Link>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} LiveQuiz — Make Learning Fun
      </footer>
    </div>
  );
}
