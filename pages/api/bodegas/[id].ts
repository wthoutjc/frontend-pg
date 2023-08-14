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
        const { id, limit, offset, pedidos } = req.query;

        if (pedidos) {
          const response = await fetch(
            `${process.env.API_URL}/bodegas/${id}?pedidos=1&limit=${limit}&offset=${offset}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          return res.status(200).json(data);
        } else {
          const response = await fetch(`${process.env.API_URL}/bodegas/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          return res.status(response.status).json(data);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener la información de la bodega",
        });
      }
    case "PUT":
      try {
        const { id } = req.query;

        const response = await fetch(`${process.env.API_URL}/bodegas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(req.body),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al actualizar la información de la bodega",
        });
      }
    case "DELETE":
      try {
        const { id } = req.query;

        const response = await fetch(`${process.env.API_URL}/bodegas/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al eliminar la bodega",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
