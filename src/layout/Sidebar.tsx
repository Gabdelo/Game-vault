export const Sidebar = () => {
    return (
        <div className="w-60 h-screen bg-gray-800 text-white p-5 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Game Vault</h2>
            <ul>
                <li className="mb-2"><a href="/" className="hover:text-blue-500"> COSAS</a></li>
                <li className="mb-2"><a href="/library" className="hover:text-blue-500">MI BIBLIOTECA</a></li>
                <li className="mb-2"><a href="/games" className="hover:text-blue-500">MÁS JUEGOS</a></li>
            </ul>
        </div>
    )
}