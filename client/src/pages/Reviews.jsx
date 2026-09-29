import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../hooks/useAuth'

export default function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [courseCode, setCourseCode] = useState('')
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const res = await api.get('/reviews')
    setReviews(res.data.reviews)
  }

  useEffect(() => { load() }, [])

  async function loadSummary(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.get('/reviews/summary', { params: { courseCode } })
      setSummary(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load summary')
    }
  }

  async function onDelete(id) {
    setError('')
    try {
      await api.delete('/reviews/' + id)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={loadSummary} className="card flex items-center gap-2">
        <input className="input" placeholder="Course code (e.g. CS101)" value={courseCode} onChange={e => setCourseCode(e.target.value)} />
        <button className="btn" type="submit">Summary</button>
      </form>
      {summary && (
        <div className="card text-sm">
          <b>{summary.courseCode}</b>: {summary.reviewCount} review(s)
          {summary.averageRating !== null && <> • average {summary.averageRating.toFixed(1)} / 5</>}
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(r => {
          const isMine = user && r.reviewedBy?._id === user.id
          return (
            <div key={r._id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.courseCode} • {r.rating}/5</div>
                  <div className="text-sm text-zinc-600">by {r.reviewedBy?.name || 'unknown'}</div>
                </div>
                {isMine && (
                  <div className="flex gap-2">
                    <Link to={`/reviews/${r._id}`} className="btn text-sm">Edit</Link>
                    <button onClick={() => onDelete(r._id)} className="btn text-sm">Delete</button>
                  </div>
                )}
              </div>
              {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
            </div>
          )
        })}
        {reviews.length === 0 && <div className="text-sm text-zinc-600">No reviews yet.</div>}
      </div>
    </div>
  )
}
