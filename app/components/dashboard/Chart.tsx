"use client"

import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts"

interface iAppProps {
  data: {
    date: string
    revenue: number
  }[]
}

const aggregateData = (data: any) => {
  const aggregated = data.reduce((acc: any, curr: any) => {
    if (acc[curr.date]) {
      acc[curr.date] += curr.revenue
    } else {
      acc[curr.date] = curr.revenue
    }
    return acc
  }, {})

  return Object.keys(aggregated).map((date) => ({
    date,
    revenue: aggregated[date],
  }))
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-sm font-bold text-green-600">
          {new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: "AED",
          }).format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

export function Chart({ data }: iAppProps) {
  const processedData = aggregateData(data)
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={processedData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          tickFormatter={(value) => `${value} AED`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
