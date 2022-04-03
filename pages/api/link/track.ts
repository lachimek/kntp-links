import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../db'

type TrackReponse = {
  error: boolean
  message: string
}

interface TrackNextApiRequest extends NextApiRequest {
  body: {
    linkId: string
  }
}

export default async function handler(
  req: TrackNextApiRequest,
  res: NextApiResponse<TrackReponse>
) {
  if (req.method === 'POST') {
    const { linkId } = req.body
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: { numberOfEntries: { increment: 1 } },
    })
    if (updatedLink) {
      res.status(200).json({ error: false, message: 'ok' })
    } else {
      res.status(200).json({ error: true, message: 'could_not_update_link' })
    }
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
