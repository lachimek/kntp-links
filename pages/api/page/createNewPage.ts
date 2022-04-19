import type { NextApiRequest, NextApiResponse } from 'next'
const formidable = require('formidable-serverless')
import { CID, create } from 'ipfs-http-client'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
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
    const form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err: any, fields: PageData, files: any) => {
      if (fields.pageUrl !== '') {
        const pages = await prisma.page.findFirst({
          where: { pageName: fields.pageUrl },
        })
        if (!pages) {
          const data = fs.createReadStream(files.file.path)
          let uploadStream = cloudinary.uploader.upload_stream(
            { format: 'png', folder: 'user_images' },
            async (error, result) => {
              if (!error && result) {
                const user = await prisma.user.update({
                  where: { email: fields.userEmail },
                  include: { pages: true },
                  data: {
                    pages: {
                      create: [
                        {
                          pageName: fields.pageUrl,
                          profilePictureLink: result.url,
                          userName: fields.pageName,
                          description: fields.pageDescription,
                        },
                      ],
                    },
                  },
                })
                res.status(200).json({ error: false, message: 'ok' })
              } else {
                console.error(error)
                res.status(200).json({ error: true, message: 'upload_error' })
              }
            }
          )
          data.pipe(uploadStream)
        } else {
          res.status(200).json({ error: true, message: 'page_url_exists' })
        }
      } else {
        res.status(200).json({ error: true, message: 'no_page_url_provided' })
      }
    })
  } else {
    res.status(200).json({ error: true, message: 'Halo halo!' })
  }
}
