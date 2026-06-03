import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-4">
      <h1 className="font-heading text-6xl text-team-a">404</h1>
      <p className="text-xl text-gray-400">Room not found</p>
      <Link to="/" className="text-team-a underline">Back home</Link>
    </div>
  )
}
