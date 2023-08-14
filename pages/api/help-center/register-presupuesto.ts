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
        const response = await fetch(
          `${process.env.API_URL}/help-center/register-presupuesto`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        res.status(response.status);
        res.setHeader(
          "Content-Type",
          response.headers.get("Content-Type") || ""
        );
        res.setHeader(
          "Content-Disposition",
          response.headers.get("Content-Disposition") || ""
        );
        return res.send(response.body);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message:
            "Error al descargar el video de verificación de registro de presupuesto",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
