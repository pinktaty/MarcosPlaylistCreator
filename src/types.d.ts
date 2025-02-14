// https://developer.spotify.com/documentation/web-api/howtos/web-app-profile

type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope?: string;
};

interface Track {
    item?: {
        name: string;
        artists: { name: string }[];
        album: {
            name: string;
            album_type: string;
            release_date: string;
            total_tracks: number;
            artists: { name: string }[];
        };
        track_number: number;
        disc_number: number;
        duration_ms: number;
        popularity: number;
        uri: string
    };
    progress_ms: number;
}

interface Letter{
    writtenNumber: string;
    info: string;
}

interface SpotifyUser {
    id: string;
}

interface ObtainTrack {
    name: string,
    artists: string[],
    uri: string
}

interface OrderTrack {
    name: string,
    uri: string,
    releaseDate: string,
    album: string,
    artist: string,
    popularity: number
    addedAt: string
}

interface ObtainPlaylist{
    id: string,
    name: string,
    tracks: number
}

interface NotionTokenResponse{
    access_token: string;
}
