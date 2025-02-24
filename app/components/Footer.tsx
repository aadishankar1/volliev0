import { Heart } from "lucide-react"
<<<<<<< HEAD

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-gray-400">
          Made with <Heart className="inline-block h-4 w-4 text-red-500" /> by the Vollie team for UC Berkeley
        </p>
=======
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-muted-foreground hover:text-primary">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-muted-foreground hover:text-primary">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-sm text-muted-foreground hover:text-primary">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              Made with <Heart className="inline-block h-4 w-4 text-red-500" /> by the Volunteen team
            </p>
          </div>
        </div>
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
      </div>
    </footer>
  )
}

