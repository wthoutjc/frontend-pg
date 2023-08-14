import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "POST":
      const response = await fetch(`${process.env.API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.body.accessToken}`,
        },
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
};

export default handler;
