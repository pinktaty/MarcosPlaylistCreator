import { useState, useEffect, useRef } from "react";
import { Silkscreen } from "next/font/google";
import SelectPlaylist from "@/app/api/spotify/components/SelectPlaylist";
import AddSongPlaylist from "@/app/api/spotify/components/AddSongPlaylist";
import { addSong, createPlaylist, fetchSpotifyData } from "@/app/api/spotify/call-api";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

const actions = [
    "Add songs to a playlist",
    "Order alphabetically by name (ascendent)",
    "Order alphabetically by name (descendent)",
    "Order alphabetically by album (ascendent)",
    "Order alphabetically by album (descendent)",
    "Order alphabetically by artist (ascendent)",
    "Order alphabetically by artist (descendent)",
    "Order by release date (oldest first)",
    "Order by release date (newest first)",
    "Order by popularity (most popular first)",
    "Order by popularity (least popular first)",
    "Order by added date (oldest first)", // New action
    "Order by added date (newest first)"  // New action
];

export default function ModifyPlaylist() {
    const [playlistId, setPlaylistId] = useState("");
    const [songsObtained, setSongsObtained] = useState<OrderTrack[]>([]);
    const [newPlaylistId, setNewPlaylistId] = useState<string | null>(null);
    const [orderedUris, setOrderedUris] = useState<string[]>([]);
    const isCreatingPlaylist = useRef(false);
    const [action, setAction] = useState(-1);

    const handlePlaylistSelection = (id: string) => {
        setPlaylistId(id);
    };

    const resetProcess = () => {
        setPlaylistId("");
        setNewPlaylistId(null);
        setSongsObtained([]);
        setOrderedUris([]);
        isCreatingPlaylist.current = false;
        setAction(-1);
    };

    function extractTracks(apiResponse: any): OrderTrack[] {
        return apiResponse.tracks.items.map((item: any) => ({
            name: item.track.name,
            uri: item.track.uri,
            releaseDate: item.track.album.release_date || "Unknown",
            album: item.track.album.name,
            artist: item.track.artists.length > 0 ? item.track.artists[0].name : "Unknown",
            popularity: item.track.popularity,
            addedAt: item.added_at
        }));
    }

    async function getSongs() {
        const dataSongs = await fetchSpotifyData(`playlists/${playlistId}`);
        const songs = extractTracks(dataSongs);
        setSongsObtained(songs);
    }

    function sortTracks(
        tracks: OrderTrack[],
        key: keyof OrderTrack,
        ascending: boolean = true
    ): OrderTrack[] {
        return [...tracks].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (key === "releaseDate" || key === "addedAt") {
                const dateA = new Date(aValue as string);
                const dateB = new Date(bValue as string);
                return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            } else if (key === "popularity") {
                return ascending ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
            } else {
                return ascending
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            }
        });
    }

    function obtainUris(tracks: OrderTrack[]): string[] {
        return tracks.map(track => track.uri);
    }

    useEffect(() => {
        if (newPlaylistId && orderedUris.length > 0) {
            addSong(newPlaylistId, orderedUris).then(() => setOrderedUris([]));
            setNewPlaylistId("");
            setOrderedUris([]);
        }
    }, [newPlaylistId, orderedUris]);

    useEffect(() => {
        if (songsObtained.length > 0 && action !== -1) {
            let orderedSongs: OrderTrack[] = [];

            switch (action) {
                case 1:
                    orderedSongs = sortTracks(songsObtained, "name");
                    break;
                case 2:
                    orderedSongs = sortTracks(songsObtained, "name", false);
                    break;
                case 3:
                    orderedSongs = sortTracks(songsObtained, "album");
                    break;
                case 4:
                    orderedSongs = sortTracks(songsObtained, "album", false);
                    break;
                case 5:
                    orderedSongs = sortTracks(songsObtained, "artist");
                    break;
                case 6:
                    orderedSongs = sortTracks(songsObtained, "artist", false);
                    break;
                case 7:
                    orderedSongs = sortTracks(songsObtained, "releaseDate");
                    break;
                case 8:
                    orderedSongs = sortTracks(songsObtained, "releaseDate", false);
                    break;
                case 9:
                    orderedSongs = sortTracks(songsObtained, "popularity");
                    break;
                case 10:
                    orderedSongs = sortTracks(songsObtained, "popularity", false);
                    break;
                case 11:
                    orderedSongs = sortTracks(songsObtained, "addedAt");
                    break;
                case 12:
                    orderedSongs = sortTracks(songsObtained, "addedAt", false);
                    break;
                default:
                    return;
            }

            const uris = obtainUris(orderedSongs);
            setOrderedUris(uris);

            if (!newPlaylistId) {
                async function getPlaylistName(): Promise<string> {
                    const data = await fetchSpotifyData<{ id: string; name: string; tracks: number }>(`playlists/${playlistId}`);
                    return data?.name || "Unknown";
                }

                getPlaylistName().then((name) => {
                    const newPlaylistName = `${name} ordered`;
                    createPlaylist(newPlaylistName, "Te quiero, guapo.", false).then((dataPlaylist) => {
                        setNewPlaylistId(dataPlaylist.id);
                    });
                });
            }

            setAction(-1);
        }
    }, [songsObtained, action]);

    async function triggerAction(action: number) {
        if (isCreatingPlaylist.current) return;
        isCreatingPlaylist.current = true;

        await getSongs();
        setAction(action);

        isCreatingPlaylist.current = false;
    }

    function TriggerAction() {
        if (action > 0) {
            return <div></div>;
        } else {
            return <AddSongPlaylist playlistId={playlistId} />;
        }
    }

    function SelectAction() {
        return (
            <div className="w-5/6 ml-10 md:ml-14">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => triggerAction(index)}
                        className={`${silkscreen.className} mt-4 p-4 border-2 border-hisPurple bg-transparent rounded hover:bg-hisPurple transition w-full`}
                    >
                        {action}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div>
            {playlistId != "" ? (
                <div>
                    {action == -1 ? <SelectAction /> : <TriggerAction />}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col mt-2 w-full max-w-xs md:w-96">
                            <button
                                onClick={resetProcess}
                                className={`${silkscreen.className} mt-4 border-4 border-hisPurple bg-transparent rounded-2xl hover:bg-hisPurple transition w-full`}
                            >
                                Use other playlist
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <SelectPlaylist onPlaylistSelect={handlePlaylistSelection} question={"Which playlist do you want to work with?"} />
            )}
        </div>
    );
}