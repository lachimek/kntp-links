import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'db'

interface ErrorResponse {
  error: boolean
  message: string
}

interface LinkData {
  id: string
  content: string
  href: string
  explicit: boolean
}

interface TrackNextApiRequest extends NextApiRequest {
  body: LinkData
}

const sample: LinkData[] = []

export default async function handler(
  req: TrackNextApiRequest,
  res: NextApiResponse<LinkData[] | ErrorResponse>
) {
  if (req.method === 'POST') {
    console.log(req.body)
    const { id, content, href, explicit } = req.body

    sample.push({ id, content, href, explicit })

    console.log(sample)

    res.status(200).json([...sample])

    // if (updatedLink) {
    //   res.status(200).json({ error: false, message: 'ok' })
    // } else {
    //   res.status(200).json({ error: true, message: 'could_not_update_link' })
    // }
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
