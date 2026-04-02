import type { FilterCategory } from '@/components/ProductsFilter/ProductsFilter';

export type { FilterCategory };

export interface Product {
  id: string;
  name: string;
  country: Exclude<FilterCategory, 'all'>;
  price: string;
  image?: string;
}

export const COUNTRY_FLAGS: Record<Exclude<FilterCategory, 'all'>, string> = {
  taliansko:  '🇮🇹',
  azia:       '🌏',
  francuzsko: '🇫🇷',
  grecko:     '🇬🇷',
  spanielsko: '🇪🇸',
  ukrajina:   '🇺🇦',
  india:      '🇮🇳',
};

export const PLACEHOLDER_PRODUCTS: Product[] = [
  { id: '1',  name: 'San Marzano paradajky',  country: 'taliansko',  price: '3,90 €' },
  { id: '2',  name: 'Parmigiano Reggiano',    country: 'taliansko',  price: '12,50 €' },
  { id: '3',  name: 'Prosciutto di Parma',    country: 'taliansko',  price: '18,00 €' },
  { id: '4',  name: 'Pasta di Gragnano',      country: 'taliansko',  price: '4,20 €' },
  { id: '5',  name: 'Japonská sójová omáčka', country: 'azia',       price: '5,50 €' },
  { id: '6',  name: 'Thajská curry pasta',    country: 'azia',       price: '4,90 €' },
  { id: '7',  name: 'Kokosové mlieko',        country: 'azia',       price: '2,80 €' },
  { id: '8',  name: 'Ryžové rezance',         country: 'azia',       price: '3,20 €' },
  { id: '9',  name: 'Dijonská horčica',       country: 'francuzsko', price: '4,50 €' },
  { id: '10', name: 'Herbes de Provence',     country: 'francuzsko', price: '5,90 €' },
  { id: '11', name: 'Crème de marrons',       country: 'francuzsko', price: '7,20 €' },
  { id: '12', name: 'Cassoulet',              country: 'francuzsko', price: '8,90 €' },
  { id: '13', name: 'Kalamata olivy',         country: 'grecko',     price: '6,50 €' },
  { id: '14', name: 'Feta DOP',               country: 'grecko',     price: '9,90 €' },
  { id: '15', name: 'Grécky med',             country: 'grecko',     price: '11,00 €' },
  { id: '16', name: 'Manchego syr',           country: 'spanielsko', price: '13,50 €' },
  { id: '17', name: 'Chorizo Ibérico',        country: 'spanielsko', price: '15,00 €' },
  { id: '18', name: 'Slnečnicová halva',      country: 'ukrajina',   price: '5,90 €' },
  { id: '19', name: 'Pohánkový med',          country: 'ukrajina',   price: '8,50 €' },
  { id: '20', name: 'Masala korenie',         country: 'india',      price: '6,20 €' },
  { id: '21', name: 'Basmati ryža',           country: 'india',      price: '4,80 €' },
  { id: '22', name: 'Mango chutney',          country: 'india',      price: '5,40 €' },
  { id: '23', name: 'Coconut oil',            country: 'india',      price: '7,90 €' },
];
