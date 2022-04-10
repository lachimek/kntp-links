import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'db'

type Data = {
  error: boolean
  message: string | {}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'DELETE') {
    const { pageId, userId } = req.query
    const checkIfUserOwnsPage = await prisma.page.findFirst({
      where: { AND: [{ id: pageId as string }, { userId: userId as string }] },
    })

    //user owns the page
    if (checkIfUserOwnsPage && checkIfUserOwnsPage.id) {
      const deletePage = prisma.page.delete({
        where: { id: checkIfUserOwnsPage.id },
      })
      const deletePageLinks = prisma.link.deleteMany({
        where: { pageId: pageId as string },
      })
      const transaction = await prisma.$transaction([
        deletePage,
        deletePageLinks,
      ])

      const allUserPages = await prisma.page.findMany({
        where: { userId: userId as string },
      })

      console.log(transaction)
      if (transaction === null) {
        res.status(200).json({ error: true, message: 'error_deleting_page' })
      }
      res.status(200).json({ error: false, message: allUserPages })
    } else {
      res.status(200).json({ error: true, message: 'unauthorized_deletion' })
    }
  }
}
