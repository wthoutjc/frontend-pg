import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "POST":
      try {
        const { id } = req.query;

        const response = await fetch(
          `${process.env.API_URL}/forgot-password/${id}`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        return res.status(response.status).json(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error al enviar la solicitud de cambio de contraseña",
        });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
