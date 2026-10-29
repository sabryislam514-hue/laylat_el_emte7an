import { X } from 'lucide-react'
import { isDirectVideo, toEmbedUrl } from '../../context/AppContext.jsx'

export default function VideoPlayerModal({ review, onClose }) {
  const src = toEmbedUrl(review.videoUrl)
  const direct = isDirectVideo(src)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="glass neon-border relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-glow-lg">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div>
            <p className="text-sm text-cyan-300">{review.subject}</p>
            <h3 className="font-black">{review.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-xl bg-white/5 p-2 hover:bg-white/10">
            <X />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          {direct ? (
            <video src={src} controls autoPlay className="h-full w-full" />
          ) : (
            <iframe
              title={review.title}
              src={src}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  )
}
