import { useEffect, useState } from "react";
import { fetchSpotifyData } from "@/app/api/spotify/call-api";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

export default function SelectPlaylist({ onPlaylistSelect, question }: { onPlaylistSelect: (id: string) => void; question: string }) {
    const [playlistsObtained, setPlaylistsObtained] = useState<ObtainPlaylist[]>([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const fetchPlaylists = async () => {
            const data = await obtainPlaylists(userId);
            setPlaylistsObtained(data);
        };

        const fetchUserId = async () => {
            const data = await fetchSpotifyData("me");
            const userData = data as SpotifyUser;
            setUserId(userData.id);
        };

        fetchUserId().then(fetchPlaylists);
    }, [userId]);

    async function obtainPlaylists(userId: string): Promise<ObtainPlaylist[]> {
        if (!userId) return [];

        const dataPlaylists = await fetchSpotifyData(`me/playlists`);
        return extractPlaylists(dataPlaylists, userId);
    }

    function extractPlaylists(apiResponse: any, userId: string): ObtainPlaylist[] {
        return apiResponse.items
            .filter((playlist: any) => playlist.owner.id === userId)
            .map((playlist: any) => ({
                name: playlist.name,
                id: playlist.id,
                tracks: playlist.tracks.total,
            }));
    }

    return (
        <div className="w-5/6 ml-10 md:ml-14">
            <p className="mb-2">{question}</p>
            {playlistsObtained.length > 0 ? (
                <div>
                    {playlistsObtained.map((playlist) => (
                        <button
                            key={playlist.id}
                            onClick={() => onPlaylistSelect(playlist.id)}
                            className={`${silkscreen.className} mt-4 p-4 border-2 border-hisPurple bg-transparent rounded hover:bg-hisPurple transition w-full`}
                        >
                            {playlist.name} with {playlist.tracks} tracks
                        </button>
                    ))}
                </div>
            ) : (
                <div>
                    <p className="mt-4 p-4 border-2 border-hisPurple bg-transparent rounded w-full">
                        There's no playlists on your profile, now I know someone besides Marcos is using my page.
                    </p>
                </div>
            )}
        </div>
    );
}