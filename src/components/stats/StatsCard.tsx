import { CyberBox } from "../ui/CyberBox"

interface Props {
    icon: string
    label: string
    value: string | number
    color?: "cyan" | "yellow" | "purple" | "green"
}

const colorClasses: Record<string, string> = {
    cyan: "text-cyan-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    green: "text-green-400"
}

export const StatsCard = ({ icon, label, value, color = "cyan" }: Props) => {
    return (
        <CyberBox label="STATS"
                cornerLines
                glow
                accentColor="#F2FF00"
                bgColor="#0a160f"
                padding="24px">
       
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider">{label}</p>
                    <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>{value}</p>
                </div>
                <div className="text-4xl opacity-30">{icon}</div>
            </div>
      
        </CyberBox>
    )
}
