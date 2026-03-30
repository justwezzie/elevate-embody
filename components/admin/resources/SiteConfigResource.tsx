'use client'

import { useEffect, useState, useRef } from 'react'
import { Title, useNotify } from 'react-admin'
import { getSupabaseClient } from '../dataProvider'

interface ConfigRow {
  key: string
  value: string | null
  type: 'text' | 'color' | 'image'
  label: string
}

interface ConfigMap {
  [key: string]: string
}

const SECTIONS = [
  {
    heading: 'Hero Section',
    keys: ['hero_badge', 'hero_headline', 'hero_subheadline', 'hero_image'],
  },
  {
    heading: 'About Section',
    keys: ['about_heading', 'about_body', 'about_photo'],
  },
  {
    heading: 'Brand Colours',
    keys: ['color_primary', 'color_accent'],
  },
]

export function SiteConfigEdit() {
  const notify = useNotify()
  const [config, setConfig] = useState<ConfigRow[]>([])
  const [values, setValues] = useState<ConfigMap>({})
  const [saving, setSaving] = useState(false)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function load() {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase.from('site_config').select('*').order('key')
      if (error) { notify('Failed to load site config', { type: 'error' }); return }
      setConfig(data as ConfigRow[])
      const map: ConfigMap = {}
      for (const row of data as ConfigRow[]) {
        map[row.key] = row.value ?? ''
      }
      setValues(map)
    }
    load()
  }, [notify])

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = await getSupabaseClient()

      // Handle file uploads first
      for (const row of config) {
        if (row.type !== 'image') continue
        const fileInput = fileRefs.current[row.key]
        const file = fileInput?.files?.[0]
        if (!file) continue

        const ext = file.name.split('.').pop()
        const path = `cms/${row.key}-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(path, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(path)
        values[row.key] = urlData.publicUrl

        // Clear the file input
        if (fileInput) fileInput.value = ''
      }

      // Upsert all values
      const rows = Object.entries(values).map(([key, value]) => ({ key, value }))
      const { error } = await supabase
        .from('site_config')
        .upsert(rows, { onConflict: 'key' })

      if (error) throw error
      notify('Site content saved', { type: 'success' })
    } catch (err) {
      console.error(err)
      notify('Failed to save', { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  function getRow(key: string) {
    return config.find((r) => r.key === key)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    marginTop: '0.25rem',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    display: 'block',
    marginBottom: '0.25rem',
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '720px' }}>
      <Title title="Site Content" />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Site Content</h1>
      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Changes are reflected on the public site after saving.
      </p>

      {SECTIONS.map((section) => (
        <div key={section.heading} style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#166534',
              marginBottom: '1.25rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            {section.heading}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {section.keys.map((key) => {
              const row = getRow(key)
              if (!row) return null
              return (
                <div key={key}>
                  <label style={labelStyle}>{row.label}</label>

                  {row.type === 'text' && key !== 'about_body' && (
                    <input
                      style={inputStyle}
                      value={values[key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    />
                  )}

                  {row.type === 'text' && key === 'about_body' && (
                    <textarea
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                      value={values[key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    />
                  )}

                  {row.type === 'color' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <input
                        style={{ ...inputStyle, flex: 1, marginTop: 0 }}
                        value={values[key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        placeholder="e.g. oklch(0.40 0.15 160)"
                      />
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                        OKLCH value
                      </p>
                    </div>
                  )}

                  {row.type === 'image' && (
                    <div style={{ marginTop: '0.25rem' }}>
                      {values[key] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={values[key]}
                          alt={row.label}
                          style={{
                            width: '160px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            marginBottom: '0.5rem',
                            display: 'block',
                          }}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => { fileRefs.current[key] = el }}
                        style={{ fontSize: '0.875rem' }}
                      />
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        Current: {values[key] || 'none'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '0.625rem 1.5rem',
          background: '#166534',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  )
}
