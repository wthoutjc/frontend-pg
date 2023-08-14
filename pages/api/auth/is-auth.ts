import { NextApiRequest, NextApiResponse } from "next";

// Next Auth
import { getToken } from "next-auth/jwt";

const secret = `${process.env.NEXTAUTH_SECRET}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "GET":
      const session = await getToken({ req, secret });
      const { accessToken } = session as { accessToken: string };

      const response = await fetch(`${process.env.API_URL}/is-auth`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
};

export default handler;
