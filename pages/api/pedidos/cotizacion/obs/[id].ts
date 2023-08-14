import { NextApiRequest, NextApiResponse } from "next";

// Next Auth
import { getToken } from "next-auth/jwt";

// Interfaces
import { IUser } from "../../../../../interfaces";

const secret = `${process.env.NEXTAUTH_SECRET}`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  const token = await getToken({ req, secret });
  const { accessToken } = (token as { user: IUser; accessToken: string }) || {};

  switch (method) {
    case "GET":
      try {
        const { id } = req.query;

        const response = await fetch(
          `${process.env.API_URL}/cotizacion-info/${id}?obs=1`,
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
          message: "Error al obtener la cotización",
        });
      }
    case "PUT":
      try {
        const { id } = req.query;
        const { obs } = req.body;
        
        const response = await fetch(
          `${process.env.API_URL}/cotizacion-info/${id}?obs_update=1`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ obs }),
          }
        );
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al actualizar la cotización",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
