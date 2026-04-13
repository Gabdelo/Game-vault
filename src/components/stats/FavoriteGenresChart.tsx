import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { GenreStats } from "../../hooks/useStats"
import CyberBox from "../ui/CyberBox"

interface Props {
    data: GenreStats[]
}

const COLORS = [
    "rgba(168, 50, 255, 0.8)",
    "rgba(255, 0, 255, 0.8)",
    "rgba(0, 255, 255, 0.8)",
    "rgba(255, 255, 0, 0.8)",
    "rgba(255, 100, 200, 0.8)",
    "rgba(100, 200, 255, 0.8)",
    "rgba(0, 255, 100, 0.8)",
    "rgba(255, 150, 0, 0.8)",
    "rgba(200, 100, 255, 0.8)",
    "rgba(100, 255, 150, 0.8)",
]

export const FavoriteGenresChart = ({ data }: Props) => {
    return (
        <CyberBox padding="10px" label="GENRES" cornerLines glow accentColor="#F2FF00" bgColor="#0a160f">
        <div className="w-full h-full rounded-lg backdrop-blur-sm justify-center items-center flex flex-col p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
                ◆ GÉNEROS FAVORITOS
            </h3>
            
            <div className="w-full h-80">
                
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => {
                                const total = data.reduce((sum, item) => sum + item.count, 0)
                                const percentage = ((value / total) * 100).toFixed(0)
                                return `${name} (${percentage}%)`
                            }}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => `${value} juegos`}
                            contentStyle={{
                                backgroundColor: "rgba(0, 0, 0, 0.9)",
                                border: "1px solid rgba(255, 255, 0, 0.8)",
                                borderRadius: "4px"
                            }}
                            labelStyle={{ color: "rgba(255, 255, 0, 0.8)" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
            </div>
            
        </div>
        </CyberBox>
    )
}
