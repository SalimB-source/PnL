import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminPassword = process.env.ADMIN_PASSWORD || ''
  const provided = req.headers['x-admin-password'] || req.body?.password
  if (provided !== adminPassword) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'GET') {
    const collections = await prisma.collection.findMany({ include: { products: { include: { images: true } } } })
    return res.status(200).json({ collections })
  }

  res.status(405).end()
}
