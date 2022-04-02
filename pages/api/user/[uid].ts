// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  uid: string
  profilePicture: string
  userName: string
  description: string
  links: {
    id: number
    content: string
    href: string
  }[]
}

type Error = {
  error: boolean
  message: string
}

const sample = [
  {
    uid: 'lachimek',
    profilePicture:
      'https://i.picsum.photos/id/1029/200/200.jpg?hmac=CQyxD4azaGb2UDjepBq254UP9v1mF-_rBhYVx8Jw8rs',
    userName: 'Michał Woźniak',
    description: 'Wszystkie moje linki',
    links: [
      {
        id: 1,
        content: 'YouTube',
        href: 'https://www.youtube.com',
        explicit: false,
      },
      {
        id: 2,
        content: 'Twitter',
        href: 'https://twitter.com/',
        explicit: false,
      },
      {
        id: 3,
        content: 'Strona +18',
        href: 'https://twitter.com/',
        explicit: true,
      },
      { id: 4, content: 'Twitch', href: 'https://twitch.tv/', explicit: false },
      {
        id: 5,
        content: 'Very long content here',
        href: 'https://twitch.tv/',
        explicit: false,
      },
      {
        id: 6,
        content: 'Kolejny groźny link +18',
        href: 'https://twitch.tv/',
        explicit: true,
      },
    ],
  },
  {
    uid: 'kntp',
    profilePicture:
      'https://i.picsum.photos/id/693/200/200.jpg?hmac=7KcC6ytdAPoUzLmXyr1r5hDXHyYQL-W1P40rRURkouE',
    userName: 'Konrad Naborzny',
    description: 'Linki naborznego :O',
    links: [
      { id: 1, content: 'Facebook', href: 'https://www.youtube.com' },
      { id: 2, content: 'Github', href: 'https://twitter.com/' },
      { id: 3, content: 'Discord', href: 'https://twitch.tv/' },
    ],
  },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { uid } = req.query

  if (req.method === 'GET') {
    const result = sample.find((item) => item.uid === uid)

    if (result === undefined)
      return res.status(404).json({ error: true, message: 'Nie znaleziono' })

    res.status(200).json(result)
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
