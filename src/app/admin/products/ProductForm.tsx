'use client';

import { useState, useEffect } from 'react';
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
  image: string;
  inStock: boolean;
  featured: boolean;
}

interface Props {
  initialData?: ProductData;
  mode: 'new' | 'edit';
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ProductData>(
    initialData ?? {
      name: '', slug: '', country: 'taliansko', flag: '🇮🇹',
      price: 0, description: '', image: '', inStock: true, featured: false,
    }
  );

  const [slugManual, setSlugManual]               = useState(!!initialData?.slug);
  const [aiAvailable, setAiAvailable]             = useState(false);
  const [aiLoading, setAiLoading]                 = useState(false);
  const [descGenerated, setDescGenerated]         = useState(false);
  const [saving, setSaving]                       = useState(false);
  const [error, setError]                         = useState('');

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

  async function generateAiDescription() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, country: form.country, flag: form.flag }),
      });
      const data = await res.json();
      if (data.description) {
        set('description', data.description);
        setDescGenerated(true);
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

          {/* Image URL */}
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Obrázok (URL)</label>
            <input
              className={styles.formInput}
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Popis</label>
            <div className={styles.descRow}>
              <textarea
                className={styles.formTextarea}
                rows={4}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Krátky popis produktu…"
              />
              {aiAvailable && (
                <button
                  type="button"
                  className={styles.btnAi}
                  onClick={generateAiDescription}
                  disabled={aiLoading || descGenerated || !form.name}
                  title={descGenerated ? 'Už vygenerované' : 'Generovať popis pomocou AI'}
                >
                  {aiLoading ? '…' : '✨'}{' '}
                  {descGenerated ? 'Vygenerované' : 'Generovať AI'}
                </button>
              )}
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
