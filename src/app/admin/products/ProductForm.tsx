'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

const COUNTRIES: { value: string; label: string; flag: string }[] = [
  { value: 'taliansko',  label: 'Taliansko',  flag: '🇮🇹' },
  { value: 'azia',       label: 'Ázia',        flag: '🌏' },
  { value: 'francuzsko', label: 'Francúzsko',  flag: '🇫🇷' },
  { value: 'grecko',     label: 'Grécko',      flag: '🇬🇷' },
  { value: 'spanielsko', label: 'Španielsko',  flag: '🇪🇸' },
  { value: 'ukrajina',   label: 'Ukrajina',    flag: '🇺🇦' },
  { value: 'india',      label: 'India',       flag: '🇮🇳' },
];

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface ProductData {
  id?: number;
  name: string;
  slug: string;
  country: string;
  flag: string;
  price: number;
  description: string;
  descriptionCs: string;
  descriptionEn: string;
  descriptionUk: string;
  descriptionGenerated: boolean;
  image: string;
  inStock: boolean;
  featured: boolean;
}

interface Props {
  initialData?: Partial<ProductData>;
  mode: 'new' | 'edit';
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ProductData>({
    name: '', slug: '', country: 'taliansko', flag: '🇮🇹',
    price: 0, description: '', descriptionCs: '', descriptionEn: '',
    descriptionUk: '', descriptionGenerated: false, image: '',
    inStock: true, featured: false,
    ...initialData,
  });

  const [slugManual, setSlugManual] = useState(!!initialData?.slug);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [imagePreview, setImagePreview] = useState(initialData?.image ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [uploadStats, setUploadStats] = useState<{ originalSize: number; optimizedSize: number; savings: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/ai-available')
      .then((r) => r.json())
      .then((d) => setAiAvailable(d.available));
  }, []);

  function set<K extends keyof ProductData>(key: K, val: ProductData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function onNameChange(name: string) {
    set('name', name);
    if (!slugManual) set('slug', toSlug(name));
  }

  function onCountryChange(country: string) {
    const c = COUNTRIES.find((c) => c.value === country);
    set('country', country);
    if (c) set('flag', c.flag);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setUploadStatus('idle');
    setUploadStats(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('country', form.country);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadStatus('err');
        return;
      }
      setImagePreview(data.url);
      set('image', data.url);
      setUploadStatus('ok');
      setUploadStats({
        originalSize:  data.originalSize,
        optimizedSize: data.optimizedSize,
        savings:       data.savings,
      });
    } catch {
      setUploadStatus('err');
    } finally {
      setUploading(false);
    }
  }

  async function generateAiDescription() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          country: form.country,
          flag: form.flag,
          productId: form.id,
        }),
      });
      if (res.status === 409) {
        // Already generated — mark so button disables
        set('descriptionGenerated', true);
        return;
      }
      const data = await res.json();
      if (data.description) {
        const d = data.description;
        setForm((f) => ({
          ...f,
          description:          d.sk ?? f.description,
          descriptionCs:        d.cs ?? f.descriptionCs,
          descriptionEn:        d.en ?? f.descriptionEn,
          descriptionUk:        d.uk ?? f.descriptionUk,
          descriptionGenerated: true,
        }));
      }
    } finally {
      setAiLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url    = mode === 'new' ? '/api/products' : `/api/products/${form.id}`;
    const method = mode === 'new' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Chyba pri ukladaní');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.formCard}>
        <div className={styles.formGrid}>

          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Názov *</label>
            <input
              className={styles.formInput}
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>

          {/* Slug */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug *</label>
            <input
              className={styles.formInput}
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set('slug', e.target.value); }}
              required
            />
          </div>

          {/* Country */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Krajina *</label>
            <select
              className={styles.formSelect}
              value={form.country}
              onChange={(e) => onCountryChange(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cena (€) *</label>
            <input
              className={styles.formInput}
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {/* Image upload */}
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Obrázok</label>
            <div className={styles.imageUploadWrap}>

              {/* Preview box — click or drop */}
              <div
                className={`${styles.imagePreviewBox} ${dragOver ? styles.dragOver : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="preview" />
                ) : (
                  <div className={styles.imagePreviewPlaceholder}>
                    <span>🖼️</span>
                    <span>Kliknúť alebo pretiahnuť</span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = '';
                }}
              />

              <div className={styles.imageUploadControls}>
                <button
                  type="button"
                  className={styles.btnUpload}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span style={{
                      display: 'inline-block', width: 12, height: 12,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  ) : '📁'}{' '}
                  {uploading ? 'Nahrávam…' : 'Vybrať obrázok'}
                </button>

                {uploadStatus === 'ok' && uploadStats && (
                  <span className={`${styles.uploadStatus} ${styles.uploadStatusOk}`}>
                    ✓ Nahraté — ušetrené {uploadStats.savings}%{' '}
                    ({(uploadStats.originalSize / 1024 / 1024).toFixed(1)} MB → {(uploadStats.optimizedSize / 1024 / 1024).toFixed(1)} MB)
                  </span>
                )}
                {uploadStatus === 'ok' && !uploadStats && (
                  <span className={`${styles.uploadStatus} ${styles.uploadStatusOk}`}>✓ Obrázok nahraný</span>
                )}
                {uploadStatus === 'err' && (
                  <span className={`${styles.uploadStatus} ${styles.uploadStatusErr}`}>✗ Chyba nahrávania</span>
                )}

                <span className={styles.uploadHint}>JPEG, PNG, WebP · max 5 MB</span>

                {/* Keep URL input hidden for manual override */}
                <input
                  type="text"
                  className={styles.formInput}
                  value={form.image}
                  onChange={(e) => { set('image', e.target.value); setImagePreview(e.target.value); }}
                  placeholder="alebo vložiť URL ručne…"
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          </div>

          {/* Description — SK */}
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>
              Popis
              {aiAvailable && (
                <button
                  type="button"
                  className={styles.btnAi}
                  style={{ marginLeft: 12 }}
                  onClick={generateAiDescription}
                  disabled={aiLoading || form.descriptionGenerated || !form.name}
                  title={form.descriptionGenerated ? 'Už vygenerované' : 'Generovať popis vo všetkých jazykoch'}
                >
                  {aiLoading ? (
                    <span style={{
                      display: 'inline-block', width: 12, height: 12,
                      border: '2px solid rgba(109,40,217,0.3)',
                      borderTop: '2px solid #6d28d9', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  ) : '✨'}{' '}
                  {form.descriptionGenerated ? 'Vygenerované' : aiLoading ? 'Generujem…' : 'Generovať AI'}
                </button>
              )}
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <span style={{ fontSize: 12, color: '#666', marginBottom: 4, display: 'block' }}>🇸🇰 Slovenčina</span>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Krátky popis produktu…"
                />
              </div>

              <div>
                <span style={{ fontSize: 12, color: '#666', marginBottom: 4, display: 'block' }}>🇨🇿 Čeština</span>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  value={form.descriptionCs}
                  onChange={(e) => set('descriptionCs', e.target.value)}
                  placeholder="Krátký popis produktu…"
                />
              </div>

              <div>
                <span style={{ fontSize: 12, color: '#666', marginBottom: 4, display: 'block' }}>🇬🇧 English</span>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  value={form.descriptionEn}
                  onChange={(e) => set('descriptionEn', e.target.value)}
                  placeholder="Short product description…"
                />
              </div>

              <div>
                <span style={{ fontSize: 12, color: '#666', marginBottom: 4, display: 'block' }}>🇺🇦 Українська</span>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  value={form.descriptionUk}
                  onChange={(e) => set('descriptionUk', e.target.value)}
                  placeholder="Короткий опис продукту…"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Dostupnosť</label>
            <label className={styles.formCheckboxRow}>
              <input
                className={styles.formCheckbox}
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set('inStock', e.target.checked)}
              />
              Na sklade
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Odporúčané</label>
            <label className={styles.formCheckboxRow}>
              <input
                className={styles.formCheckbox}
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
              />
              Zobraziť v odporúčaných
            </label>
          </div>

        </div>

        {error && <p style={{ color: '#dc2626', marginTop: 16, fontSize: 13 }}>{error}</p>}

        <div className={styles.formActions}>
          <button className={styles.btnPrimary} type="submit" disabled={saving}>
            {saving ? 'Ukladám…' : mode === 'new' ? 'Pridať produkt' : 'Uložiť zmeny'}
          </button>
          <a href="/admin/products" className={styles.btnSecondary}>Zrušiť</a>
        </div>
      </div>
    </form>
  );
}
