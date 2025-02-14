import { fetchSpotifyToken } from "@/app/api/spotify/call-api";
import { redirect } from "next/navigation";

// TODO: APLICAR FUNCION PARA REFRESCAR EL TOKEN

async function generateCodeVerifier(): Promise<string> {
    // Ensure this runs only on the client side
    if (typeof window === "undefined") {
        throw new Error("This function can only be executed in the browser.");
    }

    const generateRandomString = (length: number): string => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    const sha256 = async (plain: string): Promise<ArrayBuffer> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    };

    const base64encode = (input: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    };

    const codeVerifier: string = generateRandomString(64);
    window.sessionStorage.setItem('spotify_code_verifier', codeVerifier);

    const hashed: ArrayBuffer = await sha256(codeVerifier);

    return base64encode(hashed);
}

function isTokenValid(): boolean {
    // Ensure this runs only on the client side
    if (typeof window === "undefined") {
        return false;
    }

    const expirationTime = window.sessionStorage.getItem('spotify_expires_at');
    if (!expirationTime) return false;

    return Date.now() < Number(expirationTime);
}

const requestAuthorization = async (): Promise<void> => {
    // Ensure this runs only on the client side
    if (typeof window === "undefined") {
        return;
    }

    const clientId: string = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
    const redirectUri: string = "https://marcos-playlist-creator.vercel.app/workspace";

    if (isTokenValid()) {
        redirect(redirectUri);
    }

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing ' +
        'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ' +
        'user-top-read user-read-recently-played user-library-modify user-library-read user-read-private';

    const codeChallenge = await generateCodeVerifier();

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();

    window.location.href = authUrl.toString();
};

export const getToken = async (): Promise<void> => {
    // Ensure this runs only on the client side
    if (typeof window === "undefined") {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) throw new Error('Authorization code not found in URL.');

    const codeVerifier = window.sessionStorage.getItem('spotify_code_verifier');
    if (!codeVerifier) throw new Error('Code verifier not found.');

    const data = await fetchSpotifyToken(code, codeVerifier);

    if (data !== null) {
        window.sessionStorage.setItem('spotify_access_token', data.access_token);
        window.sessionStorage.setItem('spotify_refresh_token', data.refresh_token);

        const expiresAt = Date.now() + data.expires_in * 1000;
        window.sessionStorage.setItem('spotify_expires_at', expiresAt.toString());
    }
};

export default function Login() {
    const handleClick = () => {
        if (typeof window !== "undefined") {
            requestAuthorization();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-96">
            <button className="bg-black" onClick={handleClick}>
                <h2 className="border-2 p-6 border-blue-300 border-opacity-60 rounded-2xl text-3xl">
                    Start
                </h2>
            </button>
        </div>
    );
}