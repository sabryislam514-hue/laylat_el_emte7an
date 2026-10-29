import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function EditableText({
  field,
  as: Tag = 'span',
  className = '',
  inputClassName = '',
}) {
  const { isAdmin, liveEditMode, siteContent, updateSiteContent } = useApp()
  const [editing, setEditing] = useState(false)
  const value = siteContent[field] || ''
  const canEdit = isAdmin && liveEditMode

  if (canEdit && editing) {
    const shared = `w-full bg-slate-900/80 border border-cyan-400/40 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40 ${inputClassName || className}`
    if (Tag === 'p' || Tag === 'textarea') {
      return (
        <textarea
          autoFocus
          rows={3}
          className={shared}
          value={value}
          onChange={(e) => updateSiteContent({ [field]: e.target.value })}
          onBlur={() => setEditing(false)}
        />
      )
    }
    return (
      <input
        autoFocus
        className={shared}
        value={value}
        onChange={(e) => updateSiteContent({ [field]: e.target.value })}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
      />
    )
  }

  return (
    <Tag
      className={`${className} ${canEdit ? 'cursor-pointer rounded-xl outline-dashed outline-1 outline-cyan-400/50 hover:outline-cyan-300 hover:bg-cyan-400/5 transition' : ''}`}
      onClick={() => canEdit && setEditing(true)}
      title={canEdit ? 'اضغط للتعديل' : undefined}
    >
      {value}
    </Tag>
  )
}
