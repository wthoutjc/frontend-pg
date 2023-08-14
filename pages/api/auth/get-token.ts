import { NextApiRequest, NextApiResponse } from "next";

// Next Auth
import { getToken } from "next-auth/jwt";

const secret = `${process.env.NEXTAUTH_SECRET}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const session = await getToken({ req, secret });
        const { accessToken } = session as { accessToken: string };

        if (!accessToken) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        return res.status(200).json({
          token: accessToken,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Failed to get token",
        });
      }
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
};

export default handler;
