import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, BedDouble, UtensilsCrossed, Wallet, Leaf, ClipboardCheck,
  ArrowUpRight, ArrowDownRight, Minus, Droplets, Sun, Wrench, Users,
  CalendarClock, Coins, Info, TriangleAlert,
} from "lucide-react";

/* ============================================================================
   SAMPLE DATA LAYER
   ----------------------------------------------------------------------------
   Everything below is placeholder/sample data for framework preview only.
   It is intentionally isolated from the components so this block can later
   be swapped for a live fetch (Google Sheets, a small API, etc.) without
   touching any rendering code. Each page component receives its slice of
   this object as a prop — replace DATA with a hook like `useSheetData()`
   that returns the same shape and nothing else needs to change.
   ========================================================================== */

const DATA = {
  meta: {
    hotelName: "La Abuela",
    location: "Laguna de Apoyo, Nicaragua",
    asOf: "Aug 10, 2026 · 7:12 AM",
    currency: "USD",
  },

  overview: {
    kpis: [
      { id: "todayRev", label: "Today's Revenue", value: 3180, format: "currency", target: 3000, sub: "vs $2,940 same day last wk", trend: "up" },
      { id: "mtdRev", label: "Month-to-Date Revenue", value: 54320, format: "currency", target: 60000, sub: "90% of MTD budget", trend: "down" },
      { id: "occupancy", label: "Occupancy", value: 68, format: "percent", target: 75, sub: "11 of 16 rooms sold today", trend: "down" },
      { id: "adr", label: "ADR", value: 142, format: "currency", target: 135, sub: "Average daily rate", trend: "up" },
      { id: "restRev", label: "Restaurant Revenue (MTD)", value: 18760, format: "currency", target: 17000, sub: "64 covers today", trend: "up" },
      { id: "cashCollected", label: "Cash Collected (MTD)", value: 49900, format: "currency", target: 54320, sub: "$4,420 outstanding", trend: "flat" },
    ],
    revenue30d: [3120,2980,3340,2870,4210,4580,3990,3260,2990,3410,3680,4020,4460,4890,3760,3510,3280,3650,4110,4770,5120,4380,3920,3610,3340,3080,3560,4230,4680,3180],
    occupancy30d: [61,58,66,55,72,79,74,63,58,65,69,73,80,85,71,66,62,68,75,83,88,77,70,64,60,57,66,72,78,68],
    occTarget: 75,
    hotelVsRestaurant7d: [
      { label: "Mon", hotel: 2140, restaurant: 940 },
      { label: "Tue", hotel: 1980, restaurant: 860 },
      { label: "Wed", hotel: 2360, restaurant: 1020 },
      { label: "Thu", hotel: 2610, restaurant: 1180 },
      { label: "Fri", hotel: 3120, restaurant: 1540 },
      { label: "Sat", hotel: 3480, restaurant: 1710 },
      { label: "Sun", hotel: 2790, restaurant: 1260 },
    ],
  },

  hotel: {
    stats: [
      { id: "roomsSold", label: "Rooms Sold Today", value: 11, format: "count", target: 12, sub: "of 16 total rooms", trend: "down" },
      { id: "occupancy", label: "Occupancy", value: 68, format: "percent", target: 75, sub: "Trailing 7-day: 74%", trend: "down" },
      { id: "adr", label: "ADR", value: 142, format: "currency", target: 135, sub: "+$7 vs target", trend: "up" },
      { id: "revpar", label: "RevPAR", value: 96.6, format: "currency", target: 101, sub: "Revenue per available room", trend: "down" },
      { id: "los", label: "Avg. Length of Stay", value: 2.8, format: "nights", target: 3, sub: "nights per booking", trend: "flat" },
      { id: "ooo", label: "Out of Order", value: 1, format: "count", target: 0, sub: "Casita 4 — plumbing", trend: "down" },
    ],
    roomTypes: [
      { name: "Lagoon View Casita", rooms: 6, occupancy: 83 },
      { name: "Garden Bungalow", rooms: 6, occupancy: 62 },
      { name: "Family Suite", rooms: 4, occupancy: 55 },
    ],
    arrivals: [
      { guest: "R. Hidalgo", type: "Lagoon View Casita", nights: 3, date: "Aug 10" },
      { guest: "S. & T. Boyd", type: "Garden Bungalow", nights: 5, date: "Aug 10" },
      { guest: "M. Escobar", type: "Family Suite", nights: 2, date: "Aug 11" },
      { guest: "K. Lindqvist", type: "Lagoon View Casita", nights: 4, date: "Aug 12" },
    ],
    departures: [
      { guest: "A. Novak", type: "Garden Bungalow", date: "Aug 10" },
      { guest: "P. Duarte", type: "Lagoon View Casita", date: "Aug 11" },
    ],
  },

  restaurant: {
    stats: [
      { id: "covers", label: "Covers Today", value: 64, format: "count", target: 70, sub: "Breakfast, lunch & dinner", trend: "down" },
      { id: "avgCheck", label: "Average Check", value: 28.5, format: "currency", target: 26, sub: "Per cover", trend: "up" },
      { id: "foodCost", label: "Food Cost %", value: 31, format: "percent", target: 28, sub: "MTD, of food revenue", trend: "down" },
      { id: "restRevMtd", label: "Restaurant Revenue (MTD)", value: 18760, format: "currency", target: 17000, sub: "vs monthly budget", trend: "up" },
    ],
    mealPeriods: [
      { period: "Breakfast", revenue: 410 },
      { period: "Lunch", revenue: 360 },
      { period: "Dinner", revenue: 890 },
    ],
    topItems: [
      { name: "Lagoon Ceviche", revenue: 640 },
      { name: "Nacatamal", revenue: 520 },
      { name: "Vigorón", revenue: 470 },
      { name: "Rondón", revenue: 385 },
      { name: "Cacao & Coffee Flight", revenue: 260 },
    ],
  },

  financials: {
    stats: [
      { id: "mtdRev", label: "MTD Revenue", value: 54320, format: "currency", target: 60000, sub: "Rooms + F&B + other", trend: "down" },
      { id: "mtdExpense", label: "MTD Expenses", value: 31200, format: "currency", target: 33000, sub: "Direct + overhead", trend: "up" },
      { id: "ebitda", label: "EBITDA Margin", value: 24, format: "percent", target: 28, sub: "Trailing 30 days", trend: "down" },
      { id: "ar", label: "Accounts Receivable", value: 6850, format: "currency", target: 5000, sub: "OTA + corporate accounts", trend: "down" },
      { id: "ap", label: "Accounts Payable", value: 4120, format: "currency", target: 6000, sub: "Due within 30 days", trend: "up" },
      { id: "cash", label: "Cash Collected (MTD)", value: 49900, format: "currency", target: 54320, sub: "vs invoiced revenue", trend: "flat" },
    ],
    revenueVsBudget6mo: [
      { label: "Mar", actual: 58200, budget: 56000 },
      { label: "Apr", actual: 61400, budget: 60000 },
      { label: "May", actual: 65900, budget: 64000 },
      { label: "Jun", actual: 59800, budget: 63000 },
      { label: "Jul", actual: 68200, budget: 66000 },
      { label: "Aug*", actual: 54320, budget: 60000 },
    ],
    expenseBreakdown: [
      { name: "Payroll", value: 14200, color: "#1E3A2E" },
      { name: "F&B Cost", value: 6100, color: "#B5654A" },
      { name: "Utilities & Energy", value: 3400, color: "#B8935A" },
      { name: "Maintenance", value: 2600, color: "#5C4433" },
      { name: "Other Overhead", value: 4900, color: "#8A9A8C" },
    ],
  },

  operations: {
    stats: [
      { id: "staff", label: "Staff Scheduled Today", value: 22, format: "count", target: 20, sub: "Across all departments", trend: "up" },
      { id: "tickets", label: "Open Maintenance Tickets", value: 4, format: "count", target: 2, sub: "2 marked high priority", trend: "down" },
      { id: "energyCost", label: "Energy Cost (MTD)", value: 2140, format: "currency", target: 2300, sub: "Grid + backup generator", trend: "up" },
      { id: "waterUse", label: "Water Use / Guest-Night", value: 210, format: "liters", target: 180, sub: "Trailing 7-day average", trend: "down" },
    ],
    sustainability: [
      { label: "Solar Power Share", value: 62, target: 70, icon: "sun" },
      { label: "Waste Diverted from Landfill", value: 71, target: 65, icon: "leaf" },
      { label: "Water Use vs. Target", value: 86, target: 100, icon: "droplet", invert: true },
    ],
    tickets: [
      { item: "Casita 4 — bathroom plumbing", priority: "High", opened: "Aug 8" },
      { item: "Solar inverter #2 fault code", priority: "High", opened: "Aug 9" },
      { item: "Bungalow 3 — screen door", priority: "Medium", opened: "Aug 9" },
      { item: "Dock lighting — timer reset", priority: "Low", opened: "Aug 10" },
    ],
  },

  scorecard: [
    { metric: "Occupancy", category: "Hotel", target: "75%", actual: "68%", status: "bad" },
    { metric: "ADR", category: "Hotel", target: "$135", actual: "$142", status: "good" },
    { metric: "RevPAR", category: "Hotel", target: "$101", actual: "$96.60", status: "watch" },
    { metric: "Restaurant Revenue (MTD)", category: "Restaurant", target: "$17,000", actual: "$18,760", status: "good" },
    { metric: "Food Cost %", category: "Restaurant", target: "28%", actual: "31%", status: "bad" },
    { metric: "EBITDA Margin", category: "Financials", target: "28%", actual: "24%", status: "watch" },
    { metric: "Cash Collected (MTD)", category: "Financials", target: "$54,320", actual: "$49,900", status: "watch" },
    { metric: "Solar Power Share", category: "Operations", target: "70%", actual: "62%", status: "watch" },
    { metric: "Water Use / Guest-Night", category: "Operations", target: "180L", actual: "210L", status: "bad" },
    { metric: "Waste Diverted", category: "Operations", target: "65%", actual: "71%", status: "good" },
  ],
};

/* ============================================================================
   NAVIGATION CONFIG — add a new tab by adding one entry + one page component
   ========================================================================== */

const NAV = [
  { id: "overview", label: "Overview", short: "Overview", icon: LayoutDashboard },
  { id: "hotel", label: "Hotel", short: "Hotel", icon: BedDouble },
  { id: "restaurant", label: "Restaurant", short: "F&B", icon: UtensilsCrossed },
  { id: "financials", label: "Financials", short: "Finance", icon: Wallet },
  { id: "operations", label: "Operations", short: "Ops", icon: Leaf },
  { id: "scorecard", label: "Scorecard", short: "Score", icon: ClipboardCheck },
];

/* ============================================================================
   FORMATTING HELPERS
   ========================================================================== */

function formatValue(value, format) {
  switch (format) {
    case "currency":
      return "$" + value.toLocaleString("en-US", { maximumFractionDigits: value % 1 === 0 ? 0 : 2 });
    case "percent":
      return value + "%";
    case "nights":
      return value + "n";
    case "liters":
      return value + "L";
    default:
      return value.toLocaleString("en-US");
  }
}

function statusFromTarget(kpi) {
  if (kpi.target == null) return "good";
  const { id, value, target } = kpi;
  const lowerIsBetter = ["mtdExpense", "foodCost", "ooo", "tickets", "ar", "waterUse"].includes(id);
  const ratio = lowerIsBetter ? target / (value || 0.0001) : value / (target || 0.0001);
  if (ratio >= 1) return "good";
  if (ratio >= 0.9) return "watch";
  return "bad";
}

const STATUS_COLOR = { good: "var(--forest-light)", watch: "var(--gold)", bad: "var(--terracotta-dark)" };
const STATUS_LABEL = { good: "On track", watch: "Watch", bad: "Below target" };

/* ============================================================================
   PRIMITIVE UI COMPONENTS
   ========================================================================== */

function TrendGlyph({ trend, size = 13 }) {
  if (trend === "up") return <ArrowUpRight size={size} strokeWidth={2.4} />;
  if (trend === "down") return <ArrowDownRight size={size} strokeWidth={2.4} />;
  return <Minus size={size} strokeWidth={2.4} />;
}

function KPICard({ kpi }) {
  const status = statusFromTarget(kpi);
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{kpi.label}</span>
        <span className="status-dot" style={{ background: STATUS_COLOR[status] }} title={STATUS_LABEL[status]} />
      </div>
      <div className="kpi-value">{formatValue(kpi.value, kpi.format)}</div>
      <div className={"kpi-sub trend-" + kpi.trend}>
        <TrendGlyph trend={kpi.trend} />
        <span>{kpi.sub}</span>
      </div>
    </div>
  );
}

function SectionCard({ title, eyebrow, children, className = "" }) {
  return (
    <div className={"section-card " + className}>
      <div className="section-head">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NeedsAttention({ items }) {
  const flagged = items.filter((k) => statusFromTarget(k) !== "good");
  if (flagged.length === 0) {
    return (
      <SectionCard title="Needs Attention" eyebrow="Signals">
        <p className="muted-note">Every tracked KPI is at or above target right now.</p>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="Needs Attention" eyebrow="Signals">
      <div className="attention-list">
        {flagged.map((k) => {
          const status = statusFromTarget(k);
          return (
            <div className="attention-row" key={k.id}>
              <TriangleAlert size={16} strokeWidth={2} color={STATUS_COLOR[status]} />
              <div className="attention-text">
                <span className="attention-label">{k.label}</span>
                <span className="attention-meta">
                  Actual {formatValue(k.value, k.format)} · Target {formatValue(k.target, k.format)}
                </span>
              </div>
              <span className="pill" style={{ borderColor: STATUS_COLOR[status], color: STATUS_COLOR[status] }}>
                {STATUS_LABEL[status]}
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ---------- Custom SVG charts (styled to brand, no default chart-lib look) --------- */

function LineChartSVG({ data, color = "var(--forest)", target, height = 220, valueSuffix = "" }) {
  const width = 600;
  const pad = { top: 18, right: 10, bottom: 22, left: 10 };
  const values = data.map((d) => d.value);
  const max = Math.max(...values, target || -Infinity);
  const min = Math.min(...values, target != null ? target : Infinity);
  const range = max - min || 1;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const pts = data.map((d, i) => [
    pad.left + (i / (data.length - 1)) * innerW,
    pad.top + innerH - ((d.value - min) / range) * innerH,
  ]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)},${pad.top + innerH} L${pts[0][0].toFixed(1)},${pad.top + innerH} Z`;
  const targetY = target != null ? pad.top + innerH - ((target - min) / range) * innerH : null;
  const gid = "grad" + Math.round(Math.random() * 1e6);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart-svg" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {targetY != null && (
        <line x1={pad.left} x2={width - pad.right} y1={targetY} y2={targetY} stroke="var(--gold)" strokeWidth="1.4" strokeDasharray="4 4" />
      )}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill={color} />}
    </svg>
  );
}

function GroupedBarChart({ data, keys, colors, height = 220 }) {
  const width = 600;
  const pad = { top: 14, right: 8, bottom: 26, left: 8 };
  const allVals = data.flatMap((d) => keys.map((k) => d[k]));
  const max = Math.max(...allVals) * 1.12;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const groupW = innerW / data.length;
  const barW = (groupW / keys.length) * 0.55;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart-svg" style={{ height }}>
      {data.map((d, gi) => {
        const groupX = pad.left + gi * groupW;
        return (
          <g key={d.label}>
            {keys.map((k, ki) => {
              const val = d[k];
              const barH = (val / max) * innerH;
              const x = groupX + groupW / 2 - (keys.length * barW) / 2 + ki * barW + 3;
              const y = pad.top + innerH - barH;
              return <rect key={k} x={x} y={y} width={barW - 6} height={barH} rx="3" fill={colors[ki]} />;
            })}
            <text x={groupX + groupW / 2} y={height - 6} textAnchor="middle" className="chart-axis-label">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function HBarList({ rows, max, colorVar = "var(--forest)", valueFormat = (v) => v }) {
  const m = max || Math.max(...rows.map((r) => r.value));
  return (
    <div className="hbar-list">
      {rows.map((r) => (
        <div className="hbar-row" key={r.label}>
          <span className="hbar-label">{r.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(r.value / m) * 100}%`, background: colorVar }} />
          </div>
          <span className="hbar-value">{valueFormat(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ value, size = 84, stroke = 9, color = "var(--forest)", label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" className="ring-value">{Math.round(value)}%</text>
      </svg>
      <div className="ring-caption">
        <span className="ring-label">{label}</span>
        {sub && <span className="ring-sub">{sub}</span>}
      </div>
    </div>
  );
}

function ContourWatermark() {
  return (
    <svg className="contour-watermark" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[60, 100, 140, 180, 220].map((r, i) => (
        <ellipse key={i} cx="620" cy="60" rx={r * 1.3} ry={r} fill="none" stroke="var(--gold)" strokeWidth="1" opacity={0.16 - i * 0.02} />
      ))}
      {[40, 80, 120].map((r, i) => (
        <ellipse key={"b" + i} cx="90" cy="360" rx={r * 1.2} ry={r} fill="none" stroke="var(--ivory-card)" strokeWidth="1" opacity={0.1} />
      ))}
    </svg>
  );
}

/* ============================================================================
   PAGE: OVERVIEW
   ========================================================================== */

function OverviewPage({ data }) {
  return (
    <div className="page">
      <PageIntro
        eyebrow="Property-wide"
        title="Overview"
        note="A first look across rooms, restaurant, and cash for the day and month to date."
      />
      <div className="kpi-grid">
        {data.kpis.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>

      <div className="chart-grid">
        <SectionCard title="30-Day Revenue" eyebrow="Trend">
          <LineChartSVG data={data.revenue30d.map((v, i) => ({ label: i, value: v }))} color="var(--forest)" />
          <ChartFoot left="30 days ago" right="Today" />
        </SectionCard>
        <SectionCard title="Occupancy Trend" eyebrow="Trend · target 75%">
          <LineChartSVG data={data.occupancy30d.map((v, i) => ({ label: i, value: v }))} color="var(--terracotta)" target={data.occTarget} />
          <ChartFoot left="30 days ago" right="Today" />
        </SectionCard>
      </div>

      <div className="chart-grid">
        <SectionCard title="Hotel vs. Restaurant Revenue" eyebrow="Last 7 days" className="span-2">
          <GroupedBarChart
            data={data.hotelVsRestaurant7d}
            keys={["hotel", "restaurant"]}
            colors={["var(--forest)", "var(--terracotta)"]}
          />
          <div className="legend-row">
            <span className="legend-item"><i style={{ background: "var(--forest)" }} />Hotel</span>
            <span className="legend-item"><i style={{ background: "var(--terracotta)" }} />Restaurant</span>
          </div>
        </SectionCard>
      </div>

      <NeedsAttention items={data.kpis} />
    </div>
  );
}

/* ============================================================================
   PAGE: HOTEL
   ========================================================================== */

function HotelPage({ data }) {
  return (
    <div className="page">
      <PageIntro eyebrow="Rooms" title="Hotel" note="Occupancy, rate, and stay performance across the 16-room property." />
      <div className="kpi-grid">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title="Occupancy by Room Type" eyebrow="Today">
          <HBarList
            rows={data.roomTypes.map((r) => ({ label: `${r.name} (${r.rooms})`, value: r.occupancy }))}
            max={100}
            colorVar="var(--forest)"
            valueFormat={(v) => v + "%"}
          />
        </SectionCard>
        <SectionCard title="Arrivals & Departures" eyebrow="Front desk">
          <div className="list-block">
            <p className="list-heading">Arriving</p>
            {data.arrivals.map((a) => (
              <div className="list-row" key={a.guest}>
                <span>{a.guest}</span>
                <span className="muted">{a.type} · {a.nights}n</span>
                <span className="muted">{a.date}</span>
              </div>
            ))}
            <p className="list-heading" style={{ marginTop: 12 }}>Departing</p>
            {data.departures.map((d) => (
              <div className="list-row" key={d.guest}>
                <span>{d.guest}</span>
                <span className="muted">{d.type}</span>
                <span className="muted">{d.date}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <NeedsAttention items={data.stats} />
    </div>
  );
}

/* ============================================================================
   PAGE: RESTAURANT
   ========================================================================== */

function RestaurantPage({ data }) {
  return (
    <div className="page">
      <PageIntro eyebrow="Food & beverage" title="Restaurant" note="Covers, checks, and food cost across the lakeside kitchen." />
      <div className="kpi-grid kpi-grid-4">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title="Revenue by Meal Period" eyebrow="Today">
          <HBarList
            rows={data.mealPeriods.map((m) => ({ label: m.period, value: m.revenue }))}
            colorVar="var(--terracotta)"
            valueFormat={(v) => "$" + v}
          />
        </SectionCard>
        <SectionCard title="Top Menu Items" eyebrow="This week, by revenue">
          <HBarList
            rows={data.topItems.map((m) => ({ label: m.name, value: m.revenue }))}
            colorVar="var(--gold)"
            valueFormat={(v) => "$" + v}
          />
        </SectionCard>
      </div>
      <NeedsAttention items={data.stats} />
    </div>
  );
}

/* ============================================================================
   PAGE: FINANCIALS
   ========================================================================== */

function FinancialsPage({ data }) {
  const maxExpense = Math.max(...data.expenseBreakdown.map((e) => e.value));
  return (
    <div className="page">
      <PageIntro eyebrow="Money" title="Financials" note="Revenue against budget, cash position, and where expenses are going." />
      <div className="kpi-grid">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title="Revenue vs. Budget" eyebrow="Last 6 months · *month to date">
          <GroupedBarChart
            data={data.revenueVsBudget6mo}
            keys={["actual", "budget"]}
            colors={["var(--forest)", "var(--gold-light)"]}
          />
          <div className="legend-row">
            <span className="legend-item"><i style={{ background: "var(--forest)" }} />Actual</span>
            <span className="legend-item"><i style={{ background: "var(--gold-light)" }} />Budget</span>
          </div>
        </SectionCard>
        <SectionCard title="Expense Breakdown" eyebrow="Month to date">
          <HBarList
            rows={data.expenseBreakdown.map((e) => ({ label: e.name, value: e.value }))}
            max={maxExpense}
            colorVar="var(--brown)"
            valueFormat={(v) => "$" + v.toLocaleString()}
          />
        </SectionCard>
      </div>
      <NeedsAttention items={data.stats} />
    </div>
  );
}

/* ============================================================================
   PAGE: OPERATIONS
   ========================================================================== */

function OperationsPage({ data }) {
  const iconMap = { sun: Sun, leaf: Leaf, droplet: Droplets };
  return (
    <div className="page">
      <PageIntro eyebrow="Behind the scenes" title="Operations" note="Staffing, maintenance, and the sustainability metrics that matter to La Abuela." />
      <div className="kpi-grid kpi-grid-4">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title="Sustainability" eyebrow="Trailing 7-day average">
          <div className="ring-row">
            {data.sustainability.map((s) => {
              const Icon = iconMap[s.icon] || Leaf;
              const color = s.value >= s.target ? "var(--forest-light)" : "var(--terracotta)";
              return (
                <ProgressRing
                  key={s.label}
                  value={s.value}
                  color={color}
                  label={s.label}
                  sub={`Target ${s.target}%`}
                />
              );
            })}
          </div>
        </SectionCard>
        <SectionCard title="Open Maintenance Tickets" eyebrow={`${data.tickets.length} open`}>
          <div className="list-block">
            {data.tickets.map((t) => (
              <div className="list-row" key={t.item}>
                <span className="ticket-icon"><Wrench size={14} strokeWidth={2} /></span>
                <span style={{ flex: 1 }}>{t.item}</span>
                <span className={"priority-pill priority-" + t.priority.toLowerCase()}>{t.priority}</span>
                <span className="muted">{t.opened}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <NeedsAttention items={data.stats} />
    </div>
  );
}

/* ============================================================================
   PAGE: SCORECARD
   ========================================================================== */

function ScorecardPage({ rows }) {
  const categories = [...new Set(rows.map((r) => r.category))];
  return (
    <div className="page">
      <PageIntro eyebrow="Monthly review" title="Scorecard" note="Every headline KPI, target vs. actual, in one place — the framework for a monthly ownership review." />
      {categories.map((cat) => (
        <SectionCard title={cat} key={cat} eyebrow="Category">
          <div className="score-table">
            <div className="score-row score-head">
              <span>Metric</span><span>Target</span><span>Actual</span><span>Status</span>
            </div>
            {rows.filter((r) => r.category === cat).map((r) => (
              <div className="score-row" key={r.metric}>
                <span>{r.metric}</span>
                <span className="mono">{r.target}</span>
                <span className="mono">{r.actual}</span>
                <span className="pill" style={{ borderColor: STATUS_COLOR[r.status], color: STATUS_COLOR[r.status] }}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ============================================================================
   SHARED PAGE PIECES
   ========================================================================== */

function PageIntro({ eyebrow, title, note }) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

function ChartFoot({ left, right }) {
  return (
    <div className="chart-foot">
      <span>{left}</span><span>{right}</span>
    </div>
  );
}

/* ============================================================================
   APP SHELL
   ========================================================================== */

export default function App() {
  const [tab, setTab] = useState("overview");

  const activePage = useMemo(() => {
    switch (tab) {
      case "overview": return <OverviewPage data={DATA.overview} />;
      case "hotel": return <HotelPage data={DATA.hotel} />;
      case "restaurant": return <RestaurantPage data={DATA.restaurant} />;
      case "financials": return <FinancialsPage data={DATA.financials} />;
      case "operations": return <OperationsPage data={DATA.operations} />;
      case "scorecard": return <ScorecardPage rows={DATA.scorecard} />;
      default: return null;
    }
  }, [tab]);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .app-root {
          --ivory: #F3EDDE;
          --ivory-card: #FBF8F1;
          --forest-deep: #16281F;
          --forest: #1E3A2E;
          --forest-light: #3F6B52;
          --terracotta: #B5654A;
          --terracotta-dark: #9C4E38;
          --terracotta-light: #D98A6B;
          --brown: #5C4433;
          --gold: #B8935A;
          --gold-light: #E4C98F;
          --ink: #2B2420;
          --ink-soft: #6B5D4F;
          --line: rgba(43,36,32,0.14);

          background: var(--ivory);
          color: var(--ink);
          font-family: 'Public Sans', -apple-system, sans-serif;
          min-height: 100vh;
          position: relative;
          padding-bottom: 92px;
        }
        .app-root * { box-sizing: border-box; }
        .mono { font-family: 'IBM Plex Mono', monospace; }

        /* ---------- Top bar ---------- */
        .top-bar {
          position: relative;
          overflow: hidden;
          background: linear-gradient(155deg, var(--forest-deep), var(--forest) 70%);
          color: var(--ivory-card);
          padding: 22px 24px 26px;
        }
        .contour-watermark { position: absolute; inset: 0; width: 100%; height: 100%; }
        .top-bar-inner { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
        .brand-block h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 28px;
          letter-spacing: 0.01em;
          margin: 0;
        }
        .brand-block p {
          margin: 4px 0 0;
          font-size: 13px;
          color: rgba(243,237,222,0.72);
          letter-spacing: 0.02em;
        }
        .top-meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .sample-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(184,147,90,0.22);
          border: 1px solid rgba(228,201,143,0.55);
          color: var(--gold-light);
          padding: 4px 10px;
          border-radius: 20px;
        }
        .as-of { font-size: 12px; color: rgba(243,237,222,0.6); }

        /* ---------- Layout ---------- */
        .layout { display: flex; align-items: flex-start; }
        .side-nav {
          width: 208px;
          flex-shrink: 0;
          padding: 20px 12px;
          position: sticky;
          top: 0;
          align-self: flex-start;
        }
        .side-nav button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 6px;
          font-family: 'Public Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .side-nav button:hover { background: rgba(30,58,46,0.06); color: var(--ink); }
        .side-nav button.active {
          background: var(--ivory-card);
          border-color: var(--line);
          color: var(--forest);
          font-weight: 600;
          box-shadow: 0 1px 0 rgba(43,36,32,0.03);
        }
        .side-nav button.active svg { color: var(--terracotta); }

        .main-col { flex: 1; min-width: 0; padding: 24px 24px 40px; }

        /* ---------- Page intro ---------- */
        .page-intro { margin-bottom: 22px; max-width: 640px; }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--terracotta-dark);
        }
        .page-intro h2 {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          margin: 4px 0 6px;
          color: var(--forest-deep);
        }
        .page-intro p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.5; }

        /* ---------- KPI grid ---------- */
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
        .kpi-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .kpi-card {
          background: var(--ivory-card);
          border: 1px solid var(--line);
          border-top: 2.5px solid var(--gold);
          border-radius: 12px;
          padding: 16px 16px 14px;
          position: relative;
        }
        .kpi-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .kpi-label {
          font-size: 11.5px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 600;
        }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 3px; flex-shrink: 0; }
        .kpi-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 26px;
          font-weight: 600;
          color: var(--forest-deep);
          margin-top: 6px;
        }
        .kpi-sub { display: flex; align-items: center; gap: 5px; font-size: 12px; margin-top: 8px; color: var(--ink-soft); }
        .kpi-sub.trend-up svg { color: var(--forest-light); }
        .kpi-sub.trend-down svg { color: var(--terracotta-dark); }
        .kpi-sub.trend-flat svg { color: var(--gold); }

        /* ---------- Section cards / charts ---------- */
        .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .span-2 { grid-column: 1 / -1; }
        .section-card {
          background: var(--ivory-card);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 18px 18px 14px;
        }
        .section-head { margin-bottom: 10px; }
        .section-head h3 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; margin: 2px 0 0; color: var(--forest-deep); }
        .chart-svg { width: 100%; display: block; }
        .chart-axis-label { font-size: 10px; fill: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; }
        .chart-foot { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-soft); margin-top: 2px; font-family: 'IBM Plex Mono', monospace; }
        .legend-row { display: flex; gap: 16px; margin-top: 8px; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-soft); }
        .legend-item i { width: 9px; height: 9px; border-radius: 2px; display: inline-block; }

        /* ---------- Needs attention ---------- */
        .attention-list { display: flex; flex-direction: column; gap: 8px; }
        .attention-row { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; background: rgba(181,101,74,0.06); }
        .attention-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .attention-label { font-size: 13.5px; font-weight: 600; color: var(--ink); }
        .attention-meta { font-size: 11.5px; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; }
        .muted-note { font-size: 13px; color: var(--ink-soft); margin: 0; }
        .pill {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
          border: 1px solid; border-radius: 20px; padding: 3px 9px; white-space: nowrap;
        }

        /* ---------- HBar list ---------- */
        .hbar-list { display: flex; flex-direction: column; gap: 10px; }
        .hbar-row { display: grid; grid-template-columns: 130px 1fr 56px; align-items: center; gap: 10px; }
        .hbar-label { font-size: 12.5px; color: var(--ink-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hbar-track { height: 8px; border-radius: 6px; background: rgba(43,36,32,0.08); overflow: hidden; }
        .hbar-fill { height: 100%; border-radius: 6px; }
        .hbar-value { font-size: 12px; text-align: right; font-family: 'IBM Plex Mono', monospace; color: var(--ink); }

        /* ---------- Lists (arrivals, tickets) ---------- */
        .list-block { display: flex; flex-direction: column; gap: 6px; }
        .list-heading { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--terracotta-dark); font-weight: 600; margin: 0 0 2px; }
        .list-row { display: flex; align-items: center; gap: 10px; font-size: 13px; padding: 6px 0; border-bottom: 1px solid var(--line); }
        .list-row:last-child { border-bottom: none; }
        .list-row .muted { color: var(--ink-soft); font-size: 12px; }
        .ticket-icon { color: var(--terracotta-dark); display: flex; }
        .priority-pill { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 600; text-transform: uppercase; }
        .priority-high { background: rgba(156,78,56,0.14); color: var(--terracotta-dark); }
        .priority-medium { background: rgba(184,147,90,0.18); color: var(--gold); }
        .priority-low { background: rgba(63,107,82,0.14); color: var(--forest-light); }

        /* ---------- Rings ---------- */
        .ring-row { display: flex; gap: 22px; flex-wrap: wrap; justify-content: space-around; padding: 6px 0; }
        .ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px; }
        .ring-value { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600; fill: var(--forest-deep); }
        .ring-caption { text-align: center; }
        .ring-label { display: block; font-size: 12px; font-weight: 600; color: var(--ink); }
        .ring-sub { display: block; font-size: 11px; color: var(--ink-soft); }

        /* ---------- Scorecard table ---------- */
        .score-table { display: flex; flex-direction: column; }
        .score-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; gap: 10px; padding: 9px 4px; border-bottom: 1px solid var(--line); font-size: 13px; }
        .score-row:last-child { border-bottom: none; }
        .score-head { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600; }
        .score-row .pill { justify-self: start; }

        /* ---------- Bottom nav (mobile) ---------- */
        .bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--ivory-card);
          border-top: 1px solid var(--line);
          padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
          z-index: 20;
        }
        .bottom-nav-grid { display: grid; grid-template-columns: repeat(6, 1fr); }
        .bottom-nav button {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          background: none; border: none; padding: 6px 2px; cursor: pointer;
          color: var(--ink-soft); font-family: 'Public Sans', sans-serif;
        }
        .bottom-nav button.active { color: var(--terracotta-dark); }
        .bottom-nav button span { font-size: 9.5px; font-weight: 600; letter-spacing: 0.01em; }

        /* ---------- Responsive ---------- */
        @media (max-width: 860px) {
          .kpi-grid, .kpi-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .chart-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .side-nav { display: none; }
          .bottom-nav { display: block; }
          .main-col { padding: 18px 14px 24px; }
          .top-bar { padding: 18px 16px 20px; }
          .brand-block h1 { font-size: 23px; }
          .kpi-value { font-size: 22px; }
          .hbar-row { grid-template-columns: 96px 1fr 48px; }
        }
        @media (max-width: 480px) {
          .kpi-grid, .kpi-grid-4 { grid-template-columns: 1fr 1fr; gap: 10px; }
          .score-row { grid-template-columns: 1.6fr 0.9fr 0.9fr 0.9fr; font-size: 12px; }
          .ring-row { gap: 12px; }
          .ring-wrap { width: 96px; }
        }
      `}</style>

      <header className="top-bar">
        <ContourWatermark />
        <div className="top-bar-inner">
          <div className="brand-block">
            <h1>{DATA.meta.hotelName}</h1>
            <p>{DATA.meta.location} · Executive Dashboard</p>
          </div>
          <div className="top-meta">
            <span className="sample-badge">Sample data</span>
            <span className="as-of">As of {DATA.meta.asOf}</span>
          </div>
        </div>
      </header>

      <div className="layout">
        <nav className="side-nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.id} className={tab === n.id ? "active" : ""} onClick={() => setTab(n.id)}>
                <Icon size={17} strokeWidth={2} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <main className="main-col">{activePage}</main>
      </div>

      <nav className="bottom-nav">
        <div className="bottom-nav-grid">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.id} className={tab === n.id ? "active" : ""} onClick={() => setTab(n.id)}>
                <Icon size={19} strokeWidth={2} />
                <span>{n.short}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
