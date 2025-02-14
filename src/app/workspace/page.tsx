"use client";
import Notes from "../components/Notes"
import {useState, useEffect, useRef} from "react";
import CurrentlyListening from "../components/CurrentlyListening";
import { useRouter } from 'next/navigation';
import { getToken }  from '../api/spotify/spotify-authorization';
import SongInfo from "@/app/workspace/SongInfo";
import CreatePlaylist from "@/app/workspace/CreatePlaylist";
import ModifyPlaylist from "@/app/workspace/ModifyPlaylist";
import AccessAnnotations from "@/app/workspace/AccessAnnotations";
import {gsap} from "gsap";
import {Silkscreen} from "next/font/google";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

const silkscreen = Silkscreen({ subsets: ['latin'], weight: ['400', '700'] });
const options: string[] = [
    "Actual song's info",
    "Create playlist",
    "Modify existent playlist",
    "Access music annotations"
];

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState(-1);
    const codeVerifier: string | null = sessionStorage.getItem('spotify_code_verifier');
    const accessToken: string | null = sessionStorage.getItem('spotify_access_token');
    const router = useRouter();

    useEffect(() => {
        if (codeVerifier) {
            if (!accessToken) {
            getToken()
                .then(() => {
                    setLoading(true);
                })
                .catch((error) => {
                    console.error('Token request failed:', error);
                });
            } else {
                setLoading(true);
            }
        } else {
            router.push('/toDo');
        }
    }, []);

    function Options() {
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const boxes = containerRef.current?.querySelectorAll(".box");
            if (!boxes) return;

            boxes.forEach((box) => {
                box.addEventListener("mousemove", (e) => {
                    const event = e as MouseEvent;
                    const { offsetX, offsetY } = event;

                    gsap.to(box, {
                        background: `radial-gradient(circle at ${offsetX}px ${offsetY}px, rgba(255, 255, 255, 0.5), #500073)`,
                        duration: 0.3,
                    });
                });

                box.addEventListener("mouseleave", () => {
                    gsap.to(box, {
                        background: "transparent",
                        duration: 0.5,
                    });
                });
            });
        }, []);

        return (
            <div
                ref={containerRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 w-full h-full md:mt-14"
            >
                {options.map((option, i) => (
                    <div
                        key={i}
                        onClick={() => setService(i)}
                        className={`cursor-pointer text-center box border-4 ${i === 3 ? "border-blue-300 border-opacity-60" : "border-hisPurple"} 
                p-14 rounded-lg shadow-md flex justify-center items-center transition-all h-full w-full ${silkscreen.className}`}
                    >
                        {option}
                    </div>
                ))}
            </div>
        );
    }

    function ServiceContainer(){
        return (
            <div className="w-full mt-6 mb-4">
                {(service != -1) && (
                    <button onClick={() => setService(-1)} className="text-2xl font-bold cursor-pointer mb-2">
                        <FontAwesomeIcon className="text-blue-300 opacity-60" icon={faBackward}/>
                    </button>
                )}
                <ServiceUsed serviceIndex={service}/>
            </div>
        );
    }

    function ServiceUsed({serviceIndex}: { serviceIndex: number }) {
        switch (serviceIndex) {
            case 0:
                return <SongInfo />;
            case 1:
                return <CreatePlaylist />;
            case 2:
                return <ModifyPlaylist />;
            case 3:
                return <AccessAnnotations />;
        }
    }

    function WorkspacePage() {
        return (
            <div className="w-full h-full rayado p-6 md:pb-20">

                <div className="flex flex-col-reverse md:flex-row w-full h-full">

                    <div className="w-full md:w-1/2 h-1/2 md:h-full flex">
                        {service === -1 ? <Options/> : <ServiceContainer/>}
                    </div>

                    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">

                        <div className="w-full flex items-center justify-center">
                            <CurrentlyListening/>
                        </div>

                        <div className="w-full mb-6 md:mb-0 flex items-center justify-center">
                            <Notes/>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return loading ? <WorkspacePage/> : (<div></div>);
}
