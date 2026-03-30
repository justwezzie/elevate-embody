'use client'

import { useEffect, useState, useRef } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { Title } from 'react-admin'
import { toast } from 'sonner'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [config, setConfig] = useState<ConfigRow[]>([])
  const [values, setValues] = useState<ConfigMap>({})
  const [saving, setSaving] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function load() {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase.from('site_config').select('*').order('key')
      if (error) {
        toast.error('Failed to load site config')
        return
      }
      setConfig(data as ConfigRow[])
      const map: ConfigMap = {}
      for (const row of data as ConfigRow[]) {
        map[row.key] = row.value ?? ''
      }
      setValues(map)
    }
    load()
  }, [])

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

      const response = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Failed to save site content')
      }

      toast.success('Site content saved')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Unknown site content save error'
      console.warn(`Site content save failed: ${message}`)
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function getRow(key: string) {
    return config.find((r) => r.key === key)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1.25rem 0.75rem 0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    minHeight: '48px',
    boxSizing: 'border-box',
    background: '#fff',
  }

  const floatingLabelStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    pointerEvents: 'none',
    transition: 'all 150ms ease',
    background: '#fff',
    paddingInline: '0.125rem',
    zIndex: 1,
  }

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem', maxWidth: '720px' }}>
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
              const hasValue = Boolean(values[key]?.trim())
              const isFocused = focusedField === key
              const shouldFloat = hasValue || isFocused
              return (
                <div key={key}>
                  {row.type === 'text' && key !== 'about_body' && (
                    <div style={{ position: 'relative' }}>
                      <label
                        style={{
                          ...floatingLabelStyle,
                          top: shouldFloat ? '0.4rem' : '50%',
                          transform: shouldFloat ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
                          transformOrigin: 'top left',
                          color: shouldFloat ? '#166534' : '#374151',
                        }}
                      >
                        {row.label}
                      </label>
                      <input
                        style={inputStyle}
                        value={values[key] ?? ''}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField((current) => (current === key ? null : current))}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      />
                    </div>
                  )}

                  {row.type === 'text' && key === 'about_body' && (
                    <div style={{ position: 'relative' }}>
                      <label
                        style={{
                          ...floatingLabelStyle,
                          top: shouldFloat ? '0.4rem' : '1rem',
                          transform: shouldFloat ? 'translateY(0) scale(0.75)' : 'translateY(0) scale(1)',
                          transformOrigin: 'top left',
                          color: shouldFloat ? '#166534' : '#374151',
                        }}
                      >
                        {row.label}
                      </label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                        value={values[key] ?? ''}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField((current) => (current === key ? null : current))}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      />
                    </div>
                  )}

                  {row.type === 'color' && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: isMobile ? 'stretch' : 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                      }}
                    >
                      <div style={{ position: 'relative', flex: 1 }}>
                        <label
                          style={{
                            ...floatingLabelStyle,
                            top: shouldFloat ? '0.4rem' : '50%',
                            transform: shouldFloat ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
                            transformOrigin: 'top left',
                            color: shouldFloat ? '#166534' : '#374151',
                          }}
                        >
                          {row.label}
                        </label>
                        <input
                          style={{ ...inputStyle }}
                          value={values[key] ?? ''}
                          onFocus={() => setFocusedField(key)}
                          onBlur={() => setFocusedField((current) => (current === key ? null : current))}
                          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        />
                      </div>
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
                            width: isMobile ? '100%' : '160px',
                            maxWidth: '240px',
                            height: isMobile ? '160px' : '100px',
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
          width: isMobile ? '100%' : undefined,
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
