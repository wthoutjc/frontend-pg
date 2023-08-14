import { NextApiRequest, NextApiResponse } from "next";

// Next Auth
import { getToken } from "next-auth/jwt";

// Interfaces
import { IUser } from "../../../interfaces";

const secret = `${process.env.NEXTAUTH_SECRET}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  const token = await getToken({ req, secret });
  const { accessToken } = (token as { user: IUser; accessToken: string }) || {};

  switch (method) {
    case "GET":
      try {
        const { limit, offset, category, filter, client, obs } = req.query;

        if (client) {
          const response = await fetch(
            `${process.env.API_URL}/pedidos?client=${client}&limit=${limit}&offset=${offset}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          return res.status(response.status).json(data);
        } else if (obs) {
          const response = await fetch(
            `${process.env.API_URL}/pedidos?obs=${obs}&category=${category}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          return res.status(response.status).json(data);
        } else {
          const response = await fetch(
            `${
              process.env.API_URL
            }/pedidos?limit=${limit}&offset=${offset}&category=${category}${
              filter ? `&filter=${filter}` : ""
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
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener los pedidos",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
