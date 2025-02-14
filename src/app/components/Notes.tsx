import {useEffect, useState} from "react";
import { Silkscreen } from 'next/font/google';
import ConectDataBase from "@/app/api/notion/notion-authorization";

const silkscreen = Silkscreen({ subsets: ['latin'], weight: ['400', '700'] });

export default function Notes(){
    const [writing, setWriting] = useState(false);
    const [searchCode, setSearchCode] = useState(false);
    const [songName, setSongName] = useState("");
    const [message, setMessage] = useState("");
    const accessToken: string | null = sessionStorage.getItem('notion_access_token');

    useEffect(() => {
        if (!searchCode) return;

        const fetchToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            if (!code) return;

            const data = await fetch("http://localhost:3000/prove");
            if (data) {
                sessionStorage.setItem("notion_access_token", "sii");
            }
        };

        fetchToken();
    }, [searchCode]);

    const handleSend = () => {
        console.log("Sending song:", songName);
        console.log("Sending message:", message);

        fetch("/api/send", {
            method: "POST",
            body: JSON.stringify({ songName, message }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    function Writing(){
        return (
            <div className="p-8 mt-6 border-4 border-blue-300 border-opacity-60 rounded-2xl w-3/4">
                <div>
                    <p className={silkscreen.className}>Song?</p>
                    <div className="flex flex-col mt-2">
                        <input
                            type="text"
                            className="mt-1 p-2 border border-blue-300 border-opacity-60 bg-transparent rounded"
                            value={songName}
                            onChange={(e) => setSongName(e.target.value)}
                        />
                        <button
                            className={`${silkscreen.className} border-2 mt-4 border-blue-300 border-opacity-60 rounded-2xl`}
                            // onClick={}
                        >
                            This song
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex flex-col">
                    <p className={silkscreen.className}>What are you thinking?</p>
                    <textarea
                        className="mt-3 bg-transparent p-2 border border-blue-300 border-opacity-60 rounded w-full"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className={`${silkscreen.className} border-4 p-2 mt-4 border-blue-300 border-opacity-60 rounded-2xl`}
                        // onClick={}
                    >
                        Write
                    </button>
                </div>
            </div>
        );
    }

    return writing ? <Writing /> : <ConectDataBase onClick={() => setSearchCode(true)} />;
}