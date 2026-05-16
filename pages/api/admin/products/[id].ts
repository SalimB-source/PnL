import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

const ADMIN_HEADER = 'x-admin-password'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provided = req.headers[ADMIN_HEADER] || req.body?.password
  if (provided !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' })

  const id = Number(req.query.id)
  if (!id) return res.status(400).json({ error: 'invalid id' })

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true } })
    if (!product) return res.status(404).json({ error: 'not found' })
    return res.status(200).json({ product })
  }

  if (req.method === 'PUT') {
    const { title, slug, description, priceCents, inventory, collectionId, images } = req.body
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        priceCents: Number(priceCents),
        inventory: Number(inventory || 0),
        collectionId: collectionId || null,
        images: images ? {
          // simple approach: delete existing and recreate
          deleteMany: {},
          create: images.map((u: string) => ({ url: u })),
        } : undefined,
      },
      include: { images: true },
    })
    return res.status(200).json({ product: updated })
  }

  if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id } })
    return res.status(204).end()
  }

  res.status(405).end()
}
