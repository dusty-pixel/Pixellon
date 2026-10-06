import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    document.body.classList.remove('has-custom-cursor')
  }, [])
  return null
}

