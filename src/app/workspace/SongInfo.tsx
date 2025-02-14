import {useEffect, useState} from "react";
import {Silkscreen} from "next/font/google";
import SelectPlaylist from "@/app/api/spotify/components/SelectPlaylist";
import {addSong, fetchSpotifyData} from "@/app/api/spotify/call-api";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

export default function SpotifyNowPlaying() {
    const [data, setData] = useState<Track | null>(null);
    const [addSongPlaylist, setAddSongPlaylist] = useState(false);

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            const data = await fetchSpotifyData<Track | null>("me/player/currently-playing");
            setData(data);
        };

        fetchCurrentlyPlaying();
    }, []);

    const handlePlaylistSelection = (id: string) => {
        addSong(id, [data?.item?.uri || ""]);
        setAddSongPlaylist(false)
    };

    function Info() {
        return (
            <div className="md:mt-10 md:mr-10">
                <div className="border-4 p-4 border-hisPurple">
                    <p>Name: {data?.item?.name}</p>
                    <p>Artists: {data?.item?.artists?.map((artist: { name: string }) => artist.name).join(", ") || "Unknown"}</p>
                    <p>Progress into the song: {data?.progress_ms} ms</p>
                    <p>Popularity: {data?.item?.popularity}</p>
                    <p>Album: {data?.item?.album?.name}</p>
                    <p>Track number: {data?.item?.track_number}</p>
                    <p>Album's type: {data?.item?.album?.album_type}</p>
                    <p>Album's release date: {data?.item?.album?.release_date}</p>
                    <p>Album's total tracks: {data?.item?.album?.total_tracks}</p>
                    <p>Album's artists: {data?.item?.album?.artists?.map((artist: { name: string }) => artist.name).join(", ") || "Unknown"}</p>
                    <p>Album's disc number: {data?.item?.disc_number}</p>
                    <p>Album's duration: {data?.item?.duration_ms} ms</p>
                </div>
                {addSongPlaylist ? (
                    <div className="mt-10">
                        <SelectPlaylist onPlaylistSelect={handlePlaylistSelection} question={"Which playlist do you" +
                            " want to add the song to?"} />
                    </div>
                ) : (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setAddSongPlaylist(true)}
                            className={`${silkscreen.className} border-hisPurple border-4 rounded-2xl px-10 py-2`}
                        >
                            Add this song to a playlist
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // TODO: Finish message
    return (
        <div>
            {data?.item != null ?
                <Info/> :
                <div className="md:mt-52 border-4 p-4 text-center border-hisPurple">
                    <p>I like how you get lost into music. You're such a nice view.</p>
                    <p></p>
                </div>
            }
        </div>
    );
}