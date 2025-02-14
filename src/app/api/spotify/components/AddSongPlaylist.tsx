import {useRef, useState} from "react";
import {addSong, fetchSearchSongs} from "@/app/api/spotify/call-api";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

export default function AddSongPlaylist({ playlistId }: { playlistId: string }) {
    const [songsObtained, setSongsObtained] = useState<ObtainTrack[]>([]);
    const [selectedUris, setSelectedUris] = useState<string[]>([]);
    const [addSongs, setAddSongs] = useState(false);

    function extractTracks(apiResponse: any): ObtainTrack[] {
        return apiResponse.tracks.items.map((track: any) => ({
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name),
            uri: track.uri
        }));
    }

    function ShowSongs() {
        const songNameRef = useRef<HTMLInputElement>(null);
        const artistNameRef = useRef<HTMLInputElement>(null);

        const handleObtainSongs = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const songName = songNameRef.current?.value.trim();
            const artistName = artistNameRef.current?.value.trim() || "";

            if (!songName) return;

            const dataSongs = await fetchSearchSongs(songName, artistName);
            const songs = extractTracks(dataSongs);
            setSongsObtained(songs);
            setAddSongs(true);
        };

        return (
            <div className="flex flex-col items-center justify-center">
                <p>Do you want to add some songs?</p>
                <form onSubmit={handleObtainSongs} className="flex flex-col mt-2 w-full max-w-xs md:w-96">
                    <label className={`${silkscreen.className} mt-6`}>
                        Song's name:
                        <input
                            type="text"
                            ref={songNameRef}
                            className="mt-3 p-2 border border-hisPurple bg-transparent text-white caret-blue-300 rounded outline-none"
                        />
                    </label>
                    <label className={`${silkscreen.className} mt-6`}>
                        Artist's name:
                        <input
                            type="text"
                            ref={artistNameRef}
                            className="mt-3 p-2 border border-hisPurple bg-transparent text-white caret-blue-300 rounded outline-none"
                        />
                    </label>
                    <button
                        type="submit"
                        className={`${silkscreen.className} mt-6 border-hisPurple border-4 rounded-2xl`}
                    >
                        Send
                    </button>
                </form>
            </div>
        );
    }

    function AddSongs() {
        const handleAddSong = (uri: string) => {
            setSelectedUris((prevUris) =>
                prevUris.includes(uri) ? prevUris : [...prevUris, uri]
            );
        };

        return (
            <div>
                <div className="w-5/6 ml-10 md:ml-14">
                    <p className="mb-2">Select the songs you desire to add:</p>
                    <div className="flex flex-col items-center">
                        {songsObtained.map((song, index) => (
                            <button
                                key={index}
                                onClick={() => handleAddSong(song.uri)}
                                className={`${silkscreen.className} mt-4 p-4 border-2 border-hisPurple bg-transparent rounded hover:bg-hisPurple transition w-full`}
                            >
                                {song.name} - {song.artists.join(", ")}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4 ml-6">
                    <button
                        onClick={() => setAddSongs(false)}
                        className={`${silkscreen.className} mt-4 border-4 border-hisPurple bg-transparent rounded-2xl hover:bg-hisPurple transition w-full`}
                    >
                        Search other song
                    </button>
                    <button
                        onClick={() => {
                            addSong(playlistId, selectedUris)
                            setSelectedUris([]);
                        }}
                        className={`${silkscreen.className} mt-4 border-4 border-hisPurple bg-transparent rounded-2xl hover:bg-hisPurple transition w-full`}
                    >
                        Add selected songs to playlist
                    </button>
                </div>
                <div className="mt-8 ml-6">
                    <p className="mb-2">Selected Songs:</p>
                    <ul>
                        {selectedUris.map((uri, index) => (
                            <li key={index} className={`${silkscreen.className} mb-2`}>{uri}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return addSongs ? <AddSongs /> : <ShowSongs />
}