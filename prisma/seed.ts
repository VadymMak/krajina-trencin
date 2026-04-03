import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const products = [
  { name: 'San Marzano paradajky',  price: 3.90,  country: 'taliansko',  flag: '🇮🇹', featured: true },
  { name: 'Parmigiano Reggiano',    price: 12.50, country: 'taliansko',  flag: '🇮🇹', featured: true },
  { name: 'Prosciutto di Parma',    price: 18.00, country: 'taliansko',  flag: '🇮🇹', featured: true },
  { name: 'Pasta di Gragnano',      price: 4.20,  country: 'taliansko',  flag: '🇮🇹', featured: true },
  { name: 'Japonska sojova omacka', price: 5.50,  country: 'azia',       flag: '🌏', featured: true },
  { name: 'Thajska curry pasta',    price: 4.90,  country: 'azia',       flag: '🌏', featured: true },
  { name: 'Kokosove mlieko',        price: 2.80,  country: 'azia',       flag: '🌏', featured: true },
  { name: 'Ryzove rezance',         price: 3.20,  country: 'azia',       flag: '🌏', featured: true },
  { name: 'Dijonska horcica',       price: 4.50,  country: 'francuzsko', flag: '🇫🇷', featured: false },
  { name: 'Herbes de Provence',     price: 5.90,  country: 'francuzsko', flag: '🇫🇷', featured: false },
  { name: 'Creme de marrons',       price: 7.20,  country: 'francuzsko', flag: '🇫🇷', featured: false },
  { name: 'Cassoulet',              price: 8.90,  country: 'francuzsko', flag: '🇫🇷', featured: false },
  { name: 'Kalamata olivy',         price: 6.50,  country: 'grecko',     flag: '🇬🇷', featured: false },
  { name: 'Feta DOP',               price: 9.90,  country: 'grecko',     flag: '🇬🇷', featured: false },
  { name: 'Grecky med',             price: 11.00, country: 'grecko',     flag: '🇬🇷', featured: false },
  { name: 'Manchego syr',           price: 13.50, country: 'spanielsko', flag: '🇪🇸', featured: false },
  { name: 'Chorizo Iberico',        price: 15.00, country: 'spanielsko', flag: '🇪🇸', featured: false },
  { name: 'Slnecnicova halva',      price: 5.90,  country: 'ukrajina',   flag: '🇺🇦', featured: false },
  { name: 'Pohankovy med',          price: 8.50,  country: 'ukrajina',   flag: '🇺🇦', featured: false },
  { name: 'Masala korenie',         price: 6.20,  country: 'india',      flag: '🇮🇳', featured: false },
  { name: 'Basmati ryza',           price: 4.80,  country: 'india',      flag: '🇮🇳', featured: false },
  { name: 'Mango chutney',          price: 5.40,  country: 'india',      flag: '🇮🇳', featured: false },
  { name: 'Coconut oil',            price: 7.90,  country: 'india',      flag: '🇮🇳', featured: false },
]

async function main() {
  console.log('Seeding products...')

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: toSlug(p.name) },
      update: {},
      create: {
        slug: toSlug(p.name),
        name: p.name,
        price: p.price,
        country: p.country,
        flag: p.flag,
        featured: p.featured,
        inStock: true,
      },
    })
  }

  console.log(`Seeded ${products.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
