import type { ReactNode } from 'react'

interface StatCardProps {
    label: string
    children: ReactNode
}

export const StatCard = ({ label, children }: StatCardProps) => (
    <div className="bg-white/[0.03] border border-white/[0.06] p-5 flex flex-col gap-2 ">
        <span className="text-[11px] text-cyan-300 uppercase tracking-widest font-medium">{label}</span>
        {children}
    </div>
)
