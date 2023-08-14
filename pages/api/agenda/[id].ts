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
        const { id, limit, offset, filter, idClient } = req.query;

        if (idClient) {
          const response = await fetch(
            `${process.env.API_URL}/agenda/${id}?idClient=${idClient}}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          return res.status(200).json(data);
        } else {
          const response = await fetch(
            `${
              process.env.API_URL
            }/agenda/${id}?limit=${limit}&offset=${offset}${
              filter ? `&filter=${filter}` : ""
            }`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          return res.status(200).json(data);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener la agenda",
        });
      }
    case "POST":
      try {
        const { id } = req.query;
        const { idClient } = req.body;

        const response = await fetch(
          `${process.env.API_URL}/agenda/${id}`,

          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({idClient}),
          }
        );
        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al registrar el cliente en la agenda",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
