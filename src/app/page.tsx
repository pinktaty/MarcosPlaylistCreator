'use client';
import SnowAnimation from './components/SnowAnimation';
import StarsAnimation from './components/StarsAnimation';
import Letter from "@/app/components/Letter";
import Login from "./api/spotify/spotify-authorization";
import {useRef} from "react";

export default function Home() {
    const loginRef = useRef<HTMLDivElement>(null);

    return (
        <div className="p-8">

            <SnowAnimation/>
            <StarsAnimation/>

            <div className="text-3xl sm:text-4xl">
                <h1 className="playwrite-ro-guides-regular">Marcos' Playlist Creator</h1>
            </div>

            <div ref={loginRef}>
                <Login/>
            </div>

            <Letter/>

        </div>
    );
}
