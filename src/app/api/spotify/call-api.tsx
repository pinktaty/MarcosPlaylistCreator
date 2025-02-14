const clientId: string = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";

export async function fetchSpotifyToken(code: string, codeVerifier: string): Promise<SpotifyTokenResponse | null> {
    try {
        const payload: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: "authorization_code",
                code,
                redirect_uri: "http://localhost:3000/workspace",
                code_verifier: codeVerifier,
            }).toString(),
        };

        const response = await fetch("https://accounts.spotify.com/api/token", payload);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as SpotifyTokenResponse;

    } catch (error) {
        console.error("Error fetching Spotify token:", error);
        return null;
    }
}

export async function fetchSpotifyData<T>(endpoint: string): Promise<T | null> {
    const token = sessionStorage.getItem("spotify_access_token") || "";
    try {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        if (!text) {
            return null;
        }

        return JSON.parse(text) as T;
    } catch (error) {
        console.error("Spotify API Fetch Error:", error);
        return null;
    }
}

export async function createPlaylist(name: string, description: string, isPublic: boolean): Promise<any> {
    const token = sessionStorage.getItem("spotify_access_token") || "";

    const fetchUserId = async () => {
        try {
            const data = await fetchSpotifyData("me");
            const userData = data as SpotifyUser;
            return userData.id;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    const userId = await fetchUserId();
    if (!userId) return;

    try {
        const payload = {
            name: name,
            public: isPublic,
            description: description,
        };

        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

export async function fetchSearchSongs(songName: string, artistName: string): Promise<ObtainTrack | null> {
    const token = sessionStorage.getItem("spotify_access_token") || "";

    try {
        const query = encodeURIComponent(`${songName} artist:${artistName}`);
        const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=3`;

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        if (!text) {
            return null;
        }

        return JSON.parse(text) as ObtainTrack;
    } catch (error) {
        console.error("Spotify API Fetch Error:", error);
        return null;
    }
}

export async function addSong(playlistId: string, uris: string[]): Promise<any> {
    const token = sessionStorage.getItem("spotify_access_token") || "";

    if (!playlistId || uris.length === 0) {
        return null;
    }

    try {
        const payload = { uris };

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al agregar canciones a la playlist:", error);
        return null;
    }
}