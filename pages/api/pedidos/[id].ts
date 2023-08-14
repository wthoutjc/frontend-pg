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

        const response = await fetch(`${process.env.API_URL}/pedidos/${id}`, {
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
    case "PUT":
      try {
        const { id, authorize, unauthorize, invoice, dispatch, complete } =
          req.query;
        const { obs, pedido } = req.body;

        if (complete) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/pedidos/${id}?complete=1`,
              {
                method: "PUT",
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
              message: "Error al completar el pedido",
            });
          }
        } else if (dispatch) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/pedidos/${id}?dispatch=1`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  pedido,
                }),
              }
            );
            const data = await response.json();
            return res.status(response.status).json(data);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              message: "Error al despachar el pedido",
            });
          }
        } else if (obs) {
          try {
            const response = await fetch(
              `${process.env.API_URL}/pedidos/${id}`,
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
        } else {
          try {
            const response = await fetch(
              `${process.env.API_URL}/pedidos/${id}?${
                authorize ? "authorize=1" : ""
              }${unauthorize ? "unauthorize=1" : ""}${
                invoice ? "invoice=1" : ""
              }`,
              {
                method: "PUT",
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
              message: "Error al procesar el pedido",
            });
          }
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al actualizar el pedido",
        });
      }
    case "DELETE":
      try {
        const { id } = req.query;

        const response = await fetch(`${process.env.API_URL}/pedidos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        });
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al eliminar el pedido",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
