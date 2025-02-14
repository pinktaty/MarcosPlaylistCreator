import {useRef, useState} from "react";
import {createPlaylist} from "@/app/api/spotify/call-api";
import { Silkscreen } from "next/font/google";
import AddSongPlaylist from "@/app/api/spotify/components/AddSongPlaylist";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

export default function CreatePlaylist() {
    const playlistNameRef = useRef<HTMLInputElement>(null);
    const playlistDescriptionRef = useRef<HTMLInputElement>(null);
    const isPublicRef = useRef<HTMLInputElement>(null);
    const [playlistId, setPlaylistId] = useState("");
    const [addSongPlaylist, setAddSongPlaylist] = useState(false);


    const handleCreatePlaylist = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const playlistName = playlistNameRef.current?.value.trim();
        const playlistDescription = playlistDescriptionRef.current?.value.trim() || "";
        const isPublic = isPublicRef.current?.checked || false;

        if (!playlistName) return;

        const dataPlaylist = await createPlaylist(playlistName, playlistDescription, isPublic);
        setPlaylistId(dataPlaylist.id);
        setAddSongPlaylist(true)
    };

    function CreatingPlaylist() {
        return (
            <div className="flex items-center justify-center">
                <form onSubmit={handleCreatePlaylist} className="flex flex-col w-full max-w-xs md:w-96">
                    <label className={`${silkscreen.className} mt-6`}>
                        Playlist's name:
                        <input
                            type="text"
                            ref={playlistNameRef}
                            className="mt-3 p-2 border border-hisPurple bg-transparent text-white caret-blue-300 rounded outline-none"
                        />
                    </label>
                    <label className={`${silkscreen.className} mt-6`}>
                        Playlist's description (optional):
                        <input
                            type="text"
                            ref={playlistDescriptionRef}
                            className="mt-3 p-2 border border-hisPurple bg-transparent text-white caret-blue-300 rounded outline-none"
                        />
                    </label>
                    <label className={`${silkscreen.className} mt-6 flex items-center`}>
                        Is Public:
                        <input
                            type="checkbox"
                            ref={isPublicRef}
                            className="ml-2 w-5 h-5 rounded-md"
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

    function AddSongs(){
        return (
            <div>
                {<AddSongPlaylist playlistId={playlistId} />}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col mt-2 w-full max-w-xs md:w-96">
                        <button
                            onClick={() => setAddSongPlaylist(false)}
                            className={`${silkscreen.className} mt-4 border-4 border-hisPurple bg-transparent rounded-2xl hover:bg-hisPurple transition w-full`}
                        >
                            Make other playlist
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return addSongPlaylist ? <AddSongs /> : <CreatingPlaylist />;
}