"use client";
import { useEffect, useState } from "react";
import { Silkscreen } from "next/font/google";
import {fetchSpotifyData} from "@/app/api/spotify/call-api";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });

export default function CurrentlyListening() {
    const [track, setTrack] = useState("No song. Really?");

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            const data = await fetchSpotifyData<{ item?: { name: string } }>("me/player/currently-playing");
            setTrack(data?.item?.name || "No song. Really?");
        };

        const timeout = setTimeout(() => {
            fetchCurrentlyPlaying();
            const interval = setInterval(fetchCurrentlyPlaying, 12000);
            return () => clearInterval(interval);
        }, 200);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="p-4 border-4 border-hisPurple rounded-2xl">
            <h1 className={silkscreen.className}>What do you want to do, beautiful?</h1>
            <h1 className={silkscreen.className}>Currently listening to... {track}</h1>
        </div>
    );
}