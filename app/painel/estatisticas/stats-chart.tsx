"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { weeklyStats } from "@/lib/mock/panel";

const config = {
  views: { label: "Visitas", color: "var(--chart-1)" },
  clicks: { label: "Cliques no WhatsApp", color: "var(--chart-2)" },
  leads: { label: "Solicitações", color: "var(--chart-4)" },
} satisfies ChartConfig;

export const StatsChart = () => (
  <ChartContainer config={config} className="h-72 w-full">
    <LineChart data={weeklyStats} margin={{ left: 0, right: 12, top: 8 }}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="week" tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} width={36} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
      {Object.keys(config).map((k) => (
        <Line key={k} dataKey={k} type="monotone" stroke={`var(--color-${k})`} strokeWidth={2} dot={false} />
      ))}
    </LineChart>
  </ChartContainer>
);
