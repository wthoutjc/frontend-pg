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
        const { id } = req.query;
        const response = await fetch(`${process.env.API_URL}/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al consultar el usuario",
        });
      }
    case "DELETE":
      try {
        const { id } = req.query;

        const response = await fetch(`${process.env.API_URL}/users/${id}`, {
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
          message: "Error al eliminar el usuario",
        });
      }
    case "PUT":
      try {
        const { email, hierarchy, id, name, lastname } = req.body;

        const response = await fetch(`${process.env.API_URL}/users/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ email, hierarchy, id, name, lastname }),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al actualizar el usuario",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
