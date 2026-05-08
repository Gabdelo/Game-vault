import type { ReactNode } from 'react'

interface InfoSectionProps {
    label: string
    children: ReactNode
}

export const InfoSection = ({ label, children }: InfoSectionProps) => (
    <div className="bg-white/[0.03] border border-white/[0.06] p-5">
        <p className="text-[11px] text-cyan-300 uppercase tracking-widest font-medium mb-3">{label}</p>
        {children}
    </div>
)
