import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-15' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { items } = req.body // [{ productId, quantity }]
    if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' })

    const line_items = [] as Stripe.Checkout.SessionCreateParams.LineItem[]

    for (const it of items) {
      const p = await prisma.product.findUnique({ where: { id: it.productId } })
      if (!p) continue
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: p.title },
          unit_amount: p.priceCents,
        },
        quantity: it.quantity || 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?canceled=true`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
