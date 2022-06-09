import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'db'

interface ErrorResponse {
  error: boolean
  message: string
}

interface LinkData {
  pageId: string
  linkId: string
  content: string
  href: string
  explicit: boolean
}

interface TrackNextApiRequest extends NextApiRequest {
  body: LinkData
}

export default async function handler(
  req: TrackNextApiRequest,
  res: NextApiResponse<any | ErrorResponse>
) {
  if (req.method === 'POST') {
    const { content, href, explicit, pageId, linkId } = req.body

    console.log(linkId)

    if (linkId !== '') {
      //update existing link of that id
      await prisma.link.update({
        where: { id: linkId },
        data: {
          content,
          href,
          explicit,
        },
      })
    } else {
      await prisma.page.update({
        where: { id: pageId },
        include: { links: true },
        data: {
          links: {
            create: [
              {
                content,
                href,
                explicit,
              },
            ],
          },
        },
      })
    }

    const pageLinks = await prisma.page.findFirst({
      where: {
        id: pageId,
      },
      select: {
        links: {
          where: {
            deleted: false,
          },
        },
      },
    })

    if (!pageLinks) {
      res.status(200).json({ error: true, message: 'page_not_found' })
    } else {
      console.log(pageLinks.links)

      res.status(200).json(pageLinks.links)
    }

    // if (updatedLink) {
    //   res.status(200).json({ error: false, message: 'ok' })
    // } else {
    //   res.status(200).json({ error: true, message: 'could_not_update_link' })
    // }
  } else if (req.method === 'DELETE') {
    if (req.headers['page-link-data'] && req.headers['page-link-data'] !== '') {
      const { pageId, linkId } = JSON.parse(
        req.headers['page-link-data'] as string
      )
      await prisma.link.update({
        where: { id: linkId },
        data: {
          deleted: true,
        },
      })

      const pageLinks = await prisma.page.findFirst({
        where: {
          id: pageId,
        },
        select: {
          links: {
            where: {
              deleted: false,
            },
          },
        },
      })

      if (!pageLinks) {
        res.status(200).json({ error: true, message: 'page_not_found' })
      } else {
        console.log(pageLinks.links)

        res.status(200).json(pageLinks.links)
      }
    }
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
