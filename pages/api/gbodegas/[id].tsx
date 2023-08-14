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
        const { id, obs } = req.query;

        if (obs) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/gbodegas/${id}?obs=1`,
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
              message: "Error al obtener las observaciones del pedido",
            });
          }
        }

        const response = await fetch(`${process.env.API_URL}/gbodegas/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al obtener el pedido",
        });
      }
    case "DELETE":
      try {
        const { id } = req.query;

        const response = await fetch(`${process.env.API_URL}/gbodegas/${id}`, {
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
          message: "Error al eliminar el pedido",
        });
      }
    case "PUT":
      try {
        const { id, dispatch } = req.query;

        const { obs } = req.body;

        if (dispatch) {
          const response = await fetch(
            `${process.env.API_URL}/gbodegas/${id}?dispatch=1`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(req.body),
            }
          );
          const data = await response.json();
          return res.status(response.status).json(data);
        } else if (obs) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/gbodegas/${id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  obs,
                }),
              }
            );
            const data = await response.json();
            return res.status(response.status).json(data);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              message: "Error al actualizar las observaciones del pedido",
            });
          }
        }
        return;
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al despachar el pedido",
        });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
