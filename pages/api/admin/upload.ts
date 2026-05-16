import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ADMIN_HEADER = 'x-admin-password'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provided = req.headers[ADMIN_HEADER] || ''
  if (provided !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'unauthorized' })

  if (req.method !== 'POST') return res.status(405).end()

  const form = formidable({ multiples: false })
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'upload error' })

    const file = files.file as formidable.File
    if (!file) return res.status(400).json({ error: 'no file' })

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const ext = path.extname(file.originalFilename || file.newFilename || '');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    const dest = path.join(uploadsDir, filename)

    const data = fs.readFileSync(file.filepath)
    fs.writeFileSync(dest, data)

    const publicPath = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/uploads/${filename}`
    return res.status(200).json({ url: publicPath })
  })
}
