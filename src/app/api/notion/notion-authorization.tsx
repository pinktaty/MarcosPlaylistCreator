const requestAuthorization = async (): Promise<void> => {
    const clientId: string = '';
    const redirect_uri = "http://localhost:3000/workspace";

    window.location.href = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code`;
};

// onClick={() => requestAuthorization().then(() => onClick(true))}
export default function ConectDataBase({ onClick }: { onClick: (searchCode: boolean) => void }) {
    return (
        <div className="flex flex-col items-center justify-center mt-12 md:mt-0 md:min-h-96">
            <button className="bg-black">
                <p className="border-2 p-6 border-blue-300 border-opacity-60 rounded-2xl">
                    Conect to notion
                </p>
            </button>
            <p className="mt-6 ml-5 mr-5 text-center">Working on it ;-;</p>
        </div>
    );
}