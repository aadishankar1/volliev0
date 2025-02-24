<<<<<<< HEAD
import ExplorePage from "./explore/page";

export default function Home() {
  // If you want to keep the redirect, uncomment the next line
  // return redirect("/explore")

  // Otherwise, render the ExplorePage directly
  return <ExplorePage />;
}
=======
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/explore")
}

>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
