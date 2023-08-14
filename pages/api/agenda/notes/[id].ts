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
        const { id, idSeller } = req.query;

        const response = await fetch(
          `${process.env.API_URL}/nota-agenda/${id}?idSeller=${idSeller}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener la nota de la agenda",
        });
      }
    case "PUT":
      try {
        const { id, idSeller } = req.query;
        const { note } = req.body;

        const response = await fetch(
          `${process.env.API_URL}/nota-agenda/${id}?idSeller=${idSeller}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ note }),
          }
        );
        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al actualizar la nota de la agenda",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
