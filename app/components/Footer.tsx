import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-gray-400">
          Made with <Heart className="inline-block h-4 w-4 text-red-500" /> by the Vollie team for UC Berkeley
        </p>
      </div>
    </footer>
  )
}

