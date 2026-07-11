'use client'
import { useState, useEffect } from 'react'

export function useStudentCount(fallback = 70) {
  const [count, setCount] = useState(fallback)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.submitted) setCount(d.submitted) })
      .catch(() => {})
  }, [])

  return count
}
