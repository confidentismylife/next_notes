'use client'

import { useEffect, useRef } from "react"
import Typed from "typed.js"

export default function TypedText({ initialText }: { initialText: string }) {
  const el = useRef(null)
  const typed = useRef<Typed | null>(null)

  useEffect(() => {
    const options = {
      strings: [initialText],
      typeSpeed: 100,
      backSpeed: 50,
      startDelay: 300,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
      fadeOut: false,
      smartBackspace: true,
    }

    if (el.current) {
      typed.current = new Typed(el.current, options)
    }

    return () => {
      if (typed.current) {
        typed.current.destroy()
      }
    }
  }, [initialText])

  return <span ref={el}></span>
} 