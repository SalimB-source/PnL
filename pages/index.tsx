import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default function Home({ products }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">PnL Store</h1>
        <p className="text-gray-600">Demo store scaffold</p>
        <nav className="mt-4">
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <article key={p.id} className="border rounded p-4">
            <img src={p.images[0]?.url} alt={p.images[0]?.alt || p.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-gray-600">{p.description}</p>
            <p className="mt-2">${(p.priceCents/100).toFixed(2)}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export async function getServerSideProps() {
  const prisma = new PrismaClient()
  const products = await prisma.product.findMany({ include: { images: true }, take: 16 })
  return { props: { products } }
}
