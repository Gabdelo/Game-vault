import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { StatusStats } from "../../hooks/useStats"
import { CyberBox } from "../ui/CyberBox"

interface Props {
    data: StatusStats[]
}

const STATUS_COLORS: Record<string, string> = {
    "playing": "rgba(0, 150, 255, 0.8)",      // Azul
    "completed": "rgba(0, 255, 100, 0.8)",    // Verde
    "wishlist": "rgba(255, 200, 0, 0.8)",     // Amarillo
    "dropped": "rgba(255, 50, 50, 0.8)",      // Rojo
    "sin-estado": "rgba(150, 150, 150, 0.8)"  // Gris
}

export const StatusBreakdown = ({ data }: Props) => {
    return (
         <CyberBox padding="10px" label="GAME'S STATUS" cornerLines glow accentColor="#F2FF00" bgColor="#0a160f">
        <div className=" rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
                ◆ Juegos por Estado
            </h3>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 0, 0.1)" />
                        <XAxis
                            dataKey="label"
                            stroke="rgba(255, 255, 0, 0.6)"
                            tick={{ fill: "rgba(255, 255, 0, 0.8)", fontSize: 12 }}
                        />
                        <YAxis
                            stroke="rgba(255, 255, 0, 0.6)"
                            tick={{ fill: "rgba(255, 255, 0, 0.8)", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.9)",
                                border: "1px solid rgba(255, 255, 0, 0.8)",
                                borderRadius: "4px"
                            }}
                            labelStyle={{ color: "rgba(255, 255, 0, 0.8)" }}
                            formatter={(value) => `${value} juegos`}
                        />
                        <Bar dataKey="count" fill="rgba(0, 150, 255, 0.8)" radius={[8, 8, 0, 0]}>
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        </CyberBox>
    )
}
