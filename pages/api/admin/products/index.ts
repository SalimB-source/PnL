import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

const ADMIN_HEADER = 'x-admin-password'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provided = req.headers[ADMIN_HEADER] || req.body?.password
  if (provided !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'GET') {
    const products = await prisma.product.findMany({ include: { images: true, collection: true } })
    return res.status(200).json({ products })
  }

  if (req.method === 'POST') {
    const { title, slug, description, priceCents, inventory, collectionId, images } = req.body
    if (!title || !slug || !priceCents) return res.status(400).json({ error: 'missing fields' })

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        priceCents: Number(priceCents),
        inventory: Number(inventory || 0),
        collectionId: collectionId || null,
        images: images && images.length ? { create: images.map((u: string) => ({ url: u })) } : undefined,
      },
      include: { images: true },
    })

    return res.status(201).json({ product })
  }

  res.status(405).end()
}
