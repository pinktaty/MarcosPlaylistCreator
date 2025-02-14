export async function fetchNotionToken(code: string): Promise<NotionTokenResponse | null> {
    try {
        const response = await fetch("http://localhost:3000/prove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as NotionTokenResponse;
    } catch (error) {
        console.error("Error fetching Notion token:", error);
        return null;
    }
}