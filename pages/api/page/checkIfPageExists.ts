import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'db'

interface ErrorResponse {
  error: boolean
  message: string
}

interface PageData {
  pageUrl: string
}

interface TrackNextApiRequest extends NextApiRequest {
  body: PageData
}

export default async function handler(
  req: TrackNextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method === 'POST') {
    console.log(req.body)
    const { pageUrl } = req.body

    const found = await prisma.page.findFirst({
      where: { pageName: pageUrl },
    })

    if (!found) {
      res.status(200).json({ error: false, message: 'ok' })
    } else {
      res.status(200).json({ error: true, message: 'page_url_exists' })
    }
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
