import type { NextApiRequest, NextApiResponse } from 'next'

type TrackReponse = {
  error: boolean
  message: string
}

interface TrackNextApiRequest extends NextApiRequest {
  body: {
    linkId: number
    uid: string
  }
}

export default function handler(
  req: TrackNextApiRequest,
  res: NextApiResponse<TrackReponse>
) {
  if (req.method === 'POST') {
    const { linkId, uid } = req.body
    console.log(linkId, uid)

    res.status(200).json({ error: false, message: 'ok' })
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
