import type { NextApiRequest, NextApiResponse } from 'next'
const formidable = require('formidable-serverless')
import { CID, create } from 'ipfs-http-client'
import fs from 'fs'
import prisma from 'db'
import path from 'path'
import { Fields } from 'formidable'

interface ErrorResponse {
  error: boolean
  message: string
}

interface PageData {
  userEmail: string
  pageName: string
  pageDescription: string
  pageUrl: string
}

interface TrackNextApiRequest extends NextApiRequest {
  body: PageData
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method === 'POST') {
    let x = process.env.INFURA_PROJECT_ID
    let y = process.env.INFURA_PROJECT_SECRET
    let b64auth = Buffer.from(`${x}:${y}`).toString('base64')
    const client = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
        Authorization: `Basic ${b64auth}`,
      },
    })

    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err: any, fields: PageData, files: any) => {
      if (fields.pageUrl !== '') {
        const pages = await prisma.page.findFirst({
          where: { pageName: fields.pageUrl },
        })
        if (!pages) {
          try {
            const data = fs.readFileSync(files.file.path)
            const { cid } = await client.add(data)
            const imgPath = cid.toV1().toString()
            const url = `https://${imgPath}.ipfs.infura-ipfs.io`
            if (imgPath !== '') {
              const user = await prisma.user.update({
                where: { email: fields.userEmail },
                include: { pages: true },
                data: {
                  pages: {
                    create: [
                      {
                        pageName: fields.pageUrl,
                        profilePictureLink: url,
                        userName: fields.pageName,
                        description: fields.pageDescription,
                      },
                    ],
                  },
                },
              })
            } else {
              res.status(200).json({ error: true, message: 'page_url_exists' })
            }
          } catch (err) {
            console.error(err)
            res.status(200).json({ error: true, message: 'ipfs_error' })
          }
        }
      }

      if (err) {
        return res.status(400).json({ error: true, message: err })
      }
    })

    res.status(200).json({ error: false, message: 'ok' })

    // if (!found) {
    //   res.status(200).json({ error: false, message: 'ok' })
    // } else {
    //   res.status(200).json({ error: true, message: 'page_url_exists' })
    // }
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
