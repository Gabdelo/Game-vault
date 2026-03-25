type Props = {
    children: React.ReactNode
    type?: "button" | "submit"
}

export const Button = ({ children, type = "button" }: Props) => {
    return (
        <button type={type} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
            {children}
        </button>
    )
}