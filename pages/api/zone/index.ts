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
        const { id, context } = req.query;

        const response = await fetch(
          `${process.env.API_URL}/zonas${context ? `?context=${context}` : ""}${
            id ? `/${id}` : ""
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = (await response.json()) as {
          departments: string[][];
          cities: string[][];
          zones: string[][];
          ok: boolean;
        };
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al constular departamentos",
        });
      }
    case "POST":
      try {
        const response = await fetch(`${process.env.API_URL}/zonas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(req.body),
        });
        const data = (await response.json()) as {
          ok: boolean;
          zone: string;
          error: string;
        };
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al registrar zona",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
