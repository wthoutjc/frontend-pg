import { NextApiRequest, NextApiResponse } from "next";

// Next Auth
import { getToken } from "next-auth/jwt";

// Interfaces
import { IUser } from "../../../../interfaces";

const secret = `${process.env.NEXTAUTH_SECRET}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  const token = await getToken({ req, secret });
  const { accessToken } = (token as { user: IUser; accessToken: string }) || {};

  switch (method) {
    case "GET":
      try {
        const { id, limit, offset, filter, month } = req.query;

        const response = await fetch(
          `${
            process.env.API_URL
          }/cotizacion/${id}?limit=${limit}&offset=${offset}&month=${month}${
            filter ? `&filter=${filter}` : ``
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener el pedido",
        });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;