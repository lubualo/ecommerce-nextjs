import { TOKEN } from "@/lib/constants"

export default function Home() {
  return (
    <div>
      <h1>Home page</h1>
      <p>Welcome to the home page: {TOKEN}</p>
    </div>
  )
}