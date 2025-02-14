import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faXmark, faBackward } from "@fortawesome/free-solid-svg-icons";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"] });
const letters: Letter[] = [
    { writtenNumber: "One.", info: "It is February 4th and I've just arrived home.\n" +
            "I write this infatuated in you scent, I swear I can feel myself melting when you hold me.\n" +
            "This project (even though it is not finished yet) has pushed me to cultivate my love for you. I realized today when I felt you.\n" +
            "This is not to say it didn't exist before, but rather that I'm now profoundly conscious about it. Even more, I choose to keep cultivating it.\n" +
            "Please be and stay conscious about my love for you too.\n" +
            "I'm afraid that if you keep telling me \"ven\" with that voice of yours, I'll go anywhere you ask me to." },
    { writtenNumber: "Two.", info: "Febrero 9.\n" +
            "Marcos,\n" +
            "Me rindo ante tus ojos, tus labios, tu nariz, tu cabello, tus manos, tu espalda... \n" +
            "Tu semblante cuando el éxtasis del sonido te consume, me rindo ante tu entrega apasionada. \n" +
            "La brusquedad de la energía que posee tu cuerpo cuando se enciende tu risa.\n" +
            "¿Puedes percibir lo mucho que me hipnotiza?\n" +
            "Has de comprender que sólo quiero tratarte suavemente,\n" +
            "vivo con la suerte permanente de tu olor en mi mente.\n" },
    { writtenNumber: "Three.", info: "I'm two days affar from giving you this present (hopefully, I fear I might not end it on time) and I just hope (redundance) you like it.\n" +
            "It has been the biggest project I've tried to do on my own and I'm kinda happy about the shape that it has taken. \n" +
            "I used your favorite colors (blue, then purple, and then black) and I got inspiration from one of my" +
            " favorite games' interface, as I wanted for you to feel comfortable while using it, like a safe space," +
            " like a hug.\n" +
            "I hope (again) you can feel all the love I poured into this, it's all yours.\n" +
            "Thank you for all your kisses in between, they gave me all the strength I needed to keep pushing forward against all the damn bugs." },
    { writtenNumber: "Four.", info: "To be honest, I do believe February 14th is a capitalist evil, but I had the vision of this tool/present and I just had to pursue it. (And it was the perfect excuse to something special for you, fun).\n" +
            "I swear I'll finish it, Notion's API seems to hate me.\n" +
            "Thank you for all the inspiration and impulse. Thank you for all the hugs, and the words, and the love. Thank you for all your support, and as always, your company.\n" +
            "Thank you for giving me the opportunity to know you, I'm really glad I get to share a life with you.\n" +
            "XOXO, happy Valentine's Day." },
];

function AnimatedMessage() {
    const messageRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const tl = gsap.timeline();

        tl.fromTo(
            messageRef.current,
            { x: 300, opacity: 0 },
            { x: -60, opacity: 1, duration: 3, ease: "power2.out" }
        );

        tl.to(messageRef.current, { x: 300, opacity: 0, duration: 5, ease: "power2.out" });
    }, []);

    return (
        <div
            ref={messageRef}
            className="fixed bottom-0 right-0 p-4 m-6 rounded-full flex justify-center items-center"
            style={{ visibility: isVisible ? "visible" : "hidden" }}
        >
            <h2 className="text-xl">Someone wants to tell you something!</h2>
        </div>
    );
}

export default function Letter() {
    const messageRef = useRef(null);
    const [isLetterOpen, setLetterOpen] = useState(false);
    const [isMarcos, setMarcos] = useState(false);
    const [readingLetter, setReadingLetter] = useState(-1);

    const authenticateMarcos = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const code = formData.get("code") as string;

        if (code === "AUUUU") {
            setMarcos(true);
        }
    };

    function AuthenticationProcess() {
        return (
            <div className="w-full flex flex-col items-center mb-10">
                <p>Code?</p>
                <form onSubmit={authenticateMarcos} className="flex flex-col mt-2 w-full max-w-xs md:w-96">
                    <input
                        type="text"
                        name="code"
                        className={`mt-1 p-2 border border-blue-300 border-opacity-60 bg-transparent text-white caret-blue-300 rounded outline-none ${silkscreen.className}`}
                    />
                    <button
                        type="submit"
                        className={`${silkscreen.className} border-2 mt-4 border-blue-300 border-opacity-60 rounded-2xl`}
                    >
                        Send
                    </button>
                </form>
            </div>
        );
    }

    function ReadingLetter({ letterIndex }: { letterIndex: number }){
        return (
            <div className="w-full">
                {letters[letterIndex].info.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        );
    }

    function LittleLetters() {
        return (
            <div className="w-full">
                {letters.map((letter, i) => (
                    <div
                        key={i}
                        onClick={() => setReadingLetter(i)}
                        className={`border-2 border-blue-300 border-opacity-60 p-3 mb-4 rounded-lg shadow-md flex justify-center items-center transition-opacity w-full cursor-pointer 
                    ${silkscreen.className}`}>
                        {letter.writtenNumber}
                    </div>
                ))}
            </div>
        );
    }

    function Button({ onClick, icon }: { onClick: () => void; icon: IconDefinition }) {
        return (
            <button onClick={onClick} className="text-2xl font-bold cursor-pointer">
                <FontAwesomeIcon className="text-blue-300 opacity-60" icon={icon} />
            </button>
        );
    }

    function LetterContainer() {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="border-2 border-blue-300 border-opacity-60 relative bg-black flex flex-col w-1/2 items-center justify-center rounded-lg shadow-lg overflow-hidden p-4">
                    <div className="w-full flex justify-end mb-1">
                        {readingLetter === -1 ? (
                            <Button
                                onClick={() => {
                                    setLetterOpen(false);
                                    setMarcos(false);
                                    setReadingLetter(-1);
                                }}
                                icon={faXmark}
                            />
                        ) : (
                            <Button onClick={() => setReadingLetter(-1)} icon={faBackward} />
                        )}
                    </div>

                    {readingLetter === -1 ? (
                        isMarcos ? <LittleLetters /> : <AuthenticationProcess />
                    ) : (
                        <ReadingLetter letterIndex={readingLetter} />
                    )}
                </div>
            </div>
        );
    }

    useEffect(() => {
        gsap.set(messageRef.current, { x: 300, opacity: 0 });
        const tl = gsap.timeline();

        tl.fromTo(
            messageRef.current,
            { x: 300, opacity: 0 },
            { x: -70, opacity: 1, duration: 2, ease: "power2.out" }
        );

        tl.to(messageRef.current, { x: 300, opacity: 0, duration: 5, ease: "power2.out" });
    }, []);

    return (
        <div>
            <AnimatedMessage />
            <div
                onClick={() => setLetterOpen(true)}
                className="cursor-pointer fixed bg-black bottom-0 right-0 border-2 border-blue-300 border-opacity-60 p-4 m-6 rounded-full flex justify-center items-center"
            >
                <h3 className="text-lg">
                    <FontAwesomeIcon icon={faEnvelope} width="25" height="20" />
                </h3>
            </div>

            {isLetterOpen && <LetterContainer />}
        </div>
    );
}