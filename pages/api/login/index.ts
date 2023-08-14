import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;

  switch (method) {
    case "POST":
      const { username, password } = req.body as {
        username: string;
        password: string;
      };

      const response = await fetch(`${process.env.API_URL}/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
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
