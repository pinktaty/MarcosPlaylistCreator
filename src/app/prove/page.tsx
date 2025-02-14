import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: "Authorization code is required" });
    }

    const clientId: string = '199d872b-594c-8061-9637-003733784f4a';
    const clientSecret: string = 'secret_43JqLnEogOffF56l0SIYn8MYCNCfJC8TkncJTFfyv7A'

    if (!clientId || !clientSecret) {
        return res.status(500).json({ message: "Server misconfiguration" });
    }

    try {
        const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const response = await fetch("https://api.notion.com/v1/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "http://localhost:3000/workspace",
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Notion API error:", errorResponse);
            return res.status(response.status).json({ message: "Failed to fetch token" });
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Notion token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}