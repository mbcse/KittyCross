import type { NextApiRequest, NextApiResponse } from "next";

export default async function getKittyImages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = JSON.parse(req.body);

    const API_LINK = "https://kittycross-dall-e-server.onrender.com/kitties";

    const response = await fetch(API_LINK, {
      method: "POST", // Change the method to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Stringify the data before sending it
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const imgURLs = await response.json();

    res.status(200).json(imgURLs);
  } catch (error) {
    console.error("Error processing kitties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
