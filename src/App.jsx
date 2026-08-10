import React, { useState, useMemo, useContext, createContext } from "react";
import {
  LayoutDashboard, BedDouble, UtensilsCrossed, Wallet, Leaf, ClipboardCheck,
  ArrowUpRight, ArrowDownRight, Minus, Droplets, Sun, Wrench, Languages,
  TriangleAlert,
} from "lucide-react";

/* ============================================================================
   SAMPLE DATA LAYER
   ----------------------------------------------------------------------------
   Everything below is placeholder/sample data for framework preview only.
   Numbers live here, keyed by stable ids. Display text (labels, names,
   captions) lives separately in STRINGS below, keyed by the same ids — that
   split is what makes the English/Spanish toggle possible, and it also means
   this whole block can later be swapped for a live fetch (Google Sheets, a
   small API, etc.) without touching STRINGS or any rendering code.
   ========================================================================== */

const DATA = {
  meta: { asOfDay: 10, asOfMonth: "aug", asOfTime: "7:12 AM" },

  overview: {
    kpis: [
      { id: "ov_todayRev", value: 3180, format: "currency", target: 3000, trend: "up" },
      { id: "ov_mtdRev", value: 54320, format: "currency", target: 60000, trend: "down" },
      { id: "ov_occupancy", value: 68, format: "percent", target: 75, trend: "down" },
      { id: "ov_adr", value: 142, format: "currency", target: 135, trend: "up" },
      { id: "ov_restRev", value: 18760, format: "currency", target: 17000, trend: "up" },
      { id: "ov_cashCollected", value: 49900, format: "currency", target: 54320, trend: "flat" },
    ],
    revenue30d: [3120,2980,3340,2870,4210,4580,3990,3260,2990,3410,3680,4020,4460,4890,3760,3510,3280,3650,4110,4770,5120,4380,3920,3610,3340,3080,3560,4230,4680,3180],
    occupancy30d: [61,58,66,55,72,79,74,63,58,65,69,73,80,85,71,66,62,68,75,83,88,77,70,64,60,57,66,72,78,68],
    occTarget: 75,
    hotelVsRestaurant7d: [
      { day: "mon", hotel: 2140, restaurant: 940 },
      { day: "tue", hotel: 1980, restaurant: 860 },
      { day: "wed", hotel: 2360, restaurant: 1020 },
      { day: "thu", hotel: 2610, restaurant: 1180 },
      { day: "fri", hotel: 3120, restaurant: 1540 },
      { day: "sat", hotel: 3480, restaurant: 1710 },
      { day: "sun", hotel: 2790, restaurant: 1260 },
    ],
  },

  hotel: {
    stats: [
      { id: "ht_roomsSold", value: 11, format: "count", target: 12, trend: "down" },
      { id: "ht_occupancy", value: 68, format: "percent", target: 75, trend: "down" },
      { id: "ht_adr", value: 142, format: "currency", target: 135, trend: "up" },
      { id: "ht_revpar", value: 96.6, format: "currency", target: 101, trend: "down" },
      { id: "ht_los", value: 2.8, format: "nights", target: 3, trend: "flat" },
      { id: "ht_ooo", value: 1, format: "count", target: 0, trend: "down" },
    ],
    roomTypes: [
      { id: "lagoonCasita", rooms: 6, occupancy: 83 },
      { id: "gardenBungalow", rooms: 6, occupancy: 62 },
      { id: "familySuite", rooms: 4, occupancy: 55 },
    ],
    arrivals: [
      { guest: "R. Hidalgo", roomTypeId: "lagoonCasita", nights: 3, day: 10, month: "aug" },
      { guest: "S. & T. Boyd", roomTypeId: "gardenBungalow", nights: 5, day: 10, month: "aug" },
      { guest: "M. Escobar", roomTypeId: "familySuite", nights: 2, day: 11, month: "aug" },
      { guest: "K. Lindqvist", roomTypeId: "lagoonCasita", nights: 4, day: 12, month: "aug" },
    ],
    departures: [
      { guest: "A. Novak", roomTypeId: "gardenBungalow", day: 10, month: "aug" },
      { guest: "P. Duarte", roomTypeId: "lagoonCasita", day: 11, month: "aug" },
    ],
  },

  restaurant: {
    stats: [
      { id: "rs_covers", value: 64, format: "count", target: 70, trend: "down" },
      { id: "rs_avgCheck", value: 28.5, format: "currency", target: 26, trend: "up" },
      { id: "rs_foodCost", value: 31, format: "percent", target: 28, trend: "down" },
      { id: "rs_restRevMtd", value: 18760, format: "currency", target: 17000, trend: "up" },
    ],
    mealPeriods: [
      { id: "breakfast", revenue: 410 },
      { id: "lunch", revenue: 360 },
      { id: "dinner", revenue: 890 },
    ],
    topItems: [
      { id: "ceviche", revenue: 640 },
      { id: "nacatamal", revenue: 520 },
      { id: "vigoron", revenue: 470 },
      { id: "rondon", revenue: 385 },
      { id: "cacaoFlight", revenue: 260 },
    ],
  },

  financials: {
    stats: [
      { id: "fi_mtdRev", value: 54320, format: "currency", target: 60000, trend: "down" },
      { id: "fi_mtdExpense", value: 31200, format: "currency", target: 33000, trend: "up" },
      { id: "fi_ebitda", value: 24, format: "percent", target: 28, trend: "down" },
      { id: "fi_ar", value: 6850, format: "currency", target: 5000, trend: "down" },
      { id: "fi_ap", value: 4120, format: "currency", target: 6000, trend: "up" },
      { id: "fi_cash", value: 49900, format: "currency", target: 54320, trend: "flat" },
    ],
    revenueVsBudget6mo: [
      { month: "mar", actual: 58200, budget: 56000 },
      { month: "apr", actual: 61400, budget: 60000 },
      { month: "may", actual: 65900, budget: 64000 },
      { month: "jun", actual: 59800, budget: 63000 },
      { month: "jul", actual: 68200, budget: 66000 },
      { month: "aug", actual: 54320, budget: 60000, current: true },
    ],
    expenseBreakdown: [
      { id: "payroll", value: 14200, color: "#1E3A2E" },
      { id: "fbCost", value: 6100, color: "#B5654A" },
      { id: "utilities", value: 3400, color: "#B8935A" },
      { id: "maintenance", value: 2600, color: "#5C4433" },
      { id: "otherOverhead", value: 4900, color: "#8A9A8C" },
    ],
  },

  operations: {
    stats: [
      { id: "op_staff", value: 22, format: "count", target: 20, trend: "up" },
      { id: "op_tickets", value: 4, format: "count", target: 2, trend: "down" },
      { id: "op_energyCost", value: 2140, format: "currency", target: 2300, trend: "up" },
      { id: "op_waterUse", value: 210, format: "liters", target: 180, trend: "down" },
    ],
    sustainability: [
      { id: "solarShare", value: 62, target: 70, icon: "sun" },
      { id: "wasteDiverted", value: 71, target: 65, icon: "leaf" },
      { id: "waterVsTarget", value: 86, target: 100, icon: "droplet" },
    ],
    tickets: [
      { id: "t1", priority: "high", day: 8, month: "aug" },
      { id: "t2", priority: "high", day: 9, month: "aug" },
      { id: "t3", priority: "medium", day: 9, month: "aug" },
      { id: "t4", priority: "low", day: 10, month: "aug" },
    ],
  },

  scorecard: [
    { id: "occupancy", category: "hotel", target: "75%", actual: "68%", status: "bad" },
    { id: "adr", category: "hotel", target: "$135", actual: "$142", status: "good" },
    { id: "revpar", category: "hotel", target: "$101", actual: "$96.60", status: "watch" },
    { id: "restRevMtd", category: "restaurant", target: "$17,000", actual: "$18,760", status: "good" },
    { id: "foodCost", category: "restaurant", target: "28%", actual: "31%", status: "bad" },
    { id: "ebitda", category: "financials", target: "28%", actual: "24%", status: "watch" },
    { id: "cashCollected", category: "financials", target: "$54,320", actual: "$49,900", status: "watch" },
    { id: "solarShare", category: "operations", target: "70%", actual: "62%", status: "watch" },
    { id: "waterUse", category: "operations", target: "180L", actual: "210L", status: "bad" },
    { id: "wasteDiverted", category: "operations", target: "65%", actual: "71%", status: "good" },
  ],
};

/* ============================================================================
   NAVIGATION CONFIG — add a new tab by adding one entry + one page component
   ========================================================================== */

const NAV = [
  { id: "overview", icon: LayoutDashboard },
  { id: "hotel", icon: BedDouble },
  { id: "restaurant", icon: UtensilsCrossed },
  { id: "financials", icon: Wallet },
  { id: "operations", icon: Leaf },
  { id: "scorecard", icon: ClipboardCheck },
];

/* ============================================================================
   TRANSLATIONS — every piece of display text, in one place per language.
   Add a language by adding one more top-level key here with the same shape.
   ========================================================================== */

const STRINGS = {
  en: {
    brand: { name: "La Abuela", tagline: "Laguna de Apoyo, Nicaragua · Executive Dashboard" },
    sampleBadge: "Sample data",
    asOf: (date) => `As of ${date}`,
    nav: {
      overview: { label: "Overview", short: "Overview" },
      hotel: { label: "Hotel", short: "Hotel" },
      restaurant: { label: "Restaurant", short: "F&B" },
      financials: { label: "Financials", short: "Finance" },
      operations: { label: "Operations", short: "Ops" },
      scorecard: { label: "Scorecard", short: "Score" },
    },
    intros: {
      overview: { eyebrow: "Property-wide", title: "Overview", note: "A first look across rooms, restaurant, and cash for the day and month to date." },
      hotel: { eyebrow: "Rooms", title: "Hotel", note: "Occupancy, rate, and stay performance across the 16-room property." },
      restaurant: { eyebrow: "Food & beverage", title: "Restaurant", note: "Covers, checks, and food cost across the lakeside kitchen." },
      financials: { eyebrow: "Money", title: "Financials", note: "Revenue against budget, cash position, and where expenses are going." },
      operations: { eyebrow: "Behind the scenes", title: "Operations", note: "Staffing, maintenance, and the sustainability metrics that matter to La Abuela." },
      scorecard: { eyebrow: "Monthly review", title: "Scorecard", note: "Every headline KPI, target vs. actual, in one place — the framework for a monthly ownership review." },
    },
    kpi: {
      ov_todayRev: { label: "Today's Revenue", sub: "vs $2,940 same day last wk" },
      ov_mtdRev: { label: "Month-to-Date Revenue", sub: "90% of MTD budget" },
      ov_occupancy: { label: "Occupancy", sub: "11 of 16 rooms sold today" },
      ov_adr: { label: "ADR", sub: "Average daily rate" },
      ov_restRev: { label: "Restaurant Revenue (MTD)", sub: "64 covers today" },
      ov_cashCollected: { label: "Cash Collected (MTD)", sub: "$4,420 outstanding" },
      ht_roomsSold: { label: "Rooms Sold Today", sub: "of 16 total rooms" },
      ht_occupancy: { label: "Occupancy", sub: "Trailing 7-day: 74%" },
      ht_adr: { label: "ADR", sub: "+$7 vs target" },
      ht_revpar: { label: "RevPAR", sub: "Revenue per available room" },
      ht_los: { label: "Avg. Length of Stay", sub: "nights per booking" },
      ht_ooo: { label: "Out of Order", sub: "Casita 4 — plumbing" },
      rs_covers: { label: "Covers Today", sub: "Breakfast, lunch & dinner" },
      rs_avgCheck: { label: "Average Check", sub: "Per cover" },
      rs_foodCost: { label: "Food Cost %", sub: "MTD, of food revenue" },
      rs_restRevMtd: { label: "Restaurant Revenue (MTD)", sub: "vs monthly budget" },
      fi_mtdRev: { label: "MTD Revenue", sub: "Rooms + F&B + other" },
      fi_mtdExpense: { label: "MTD Expenses", sub: "Direct + overhead" },
      fi_ebitda: { label: "EBITDA Margin", sub: "Trailing 30 days" },
      fi_ar: { label: "Accounts Receivable", sub: "OTA + corporate accounts" },
      fi_ap: { label: "Accounts Payable", sub: "Due within 30 days" },
      fi_cash: { label: "Cash Collected (MTD)", sub: "vs invoiced revenue" },
      op_staff: { label: "Staff Scheduled Today", sub: "Across all departments" },
      op_tickets: { label: "Open Maintenance Tickets", sub: "2 marked high priority" },
      op_energyCost: { label: "Energy Cost (MTD)", sub: "Grid + backup generator" },
      op_waterUse: { label: "Water Use / Guest-Night", sub: "Trailing 7-day average" },
    },
    sections: {
      revenue30d: { title: "30-Day Revenue", eyebrow: "Trend" },
      occupancyTrend: { title: "Occupancy Trend", eyebrow: "Trend · target 75%" },
      hotelVsRestaurant: { title: "Hotel vs. Restaurant Revenue", eyebrow: "Last 7 days" },
      roomTypeOcc: { title: "Occupancy by Room Type", eyebrow: "Today" },
      arrivalsDepartures: { title: "Arrivals & Departures", eyebrow: "Front desk" },
      mealPeriod: { title: "Revenue by Meal Period", eyebrow: "Today" },
      topItems: { title: "Top Menu Items", eyebrow: "This week, by revenue" },
      revenueVsBudget: { title: "Revenue vs. Budget", eyebrow: "Last 6 months · *month to date" },
      expenseBreakdown: { title: "Expense Breakdown", eyebrow: "Month to date" },
      sustainability: { title: "Sustainability", eyebrow: "Trailing 7-day average" },
      tickets: { title: "Open Maintenance Tickets" },
      needsAttention: { title: "Needs Attention", eyebrow: "Signals" },
    },
    chart: { thirtyDaysAgo: "30 days ago", today: "Today", hotel: "Hotel", restaurant: "Restaurant", actual: "Actual", budget: "Budget" },
    roomTypes: { lagoonCasita: "Lagoon View Casita", gardenBungalow: "Garden Bungalow", familySuite: "Family Suite" },
    mealPeriods: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" },
    menuItems: { ceviche: "Lagoon Ceviche", nacatamal: "Nacatamal", vigoron: "Vigorón", rondon: "Rondón", cacaoFlight: "Cacao & Coffee Flight" },
    expenseNames: { payroll: "Payroll", fbCost: "F&B Cost", utilities: "Utilities & Energy", maintenance: "Maintenance", otherOverhead: "Other Overhead" },
    sustainNames: { solarShare: "Solar Power Share", wasteDiverted: "Waste Diverted from Landfill", waterVsTarget: "Water Use vs. Target" },
    ticketNames: {
      t1: "Casita 4 — bathroom plumbing", t2: "Solar inverter #2 fault code",
      t3: "Bungalow 3 — screen door", t4: "Dock lighting — timer reset",
    },
    priority: { high: "High", medium: "Medium", low: "Low" },
    scorecardMetrics: {
      occupancy: "Occupancy", adr: "ADR", revpar: "RevPAR", restRevMtd: "Restaurant Revenue (MTD)",
      foodCost: "Food Cost %", ebitda: "EBITDA Margin", cashCollected: "Cash Collected (MTD)",
      solarShare: "Solar Power Share", waterUse: "Water Use / Guest-Night", wasteDiverted: "Waste Diverted",
    },
    status: { good: "On track", watch: "Watch", bad: "Below target" },
    misc: {
      arriving: "Arriving", departing: "Departing", target: "Target", metric: "Metric",
      category: "Category", allOnTrack: "Every tracked KPI is at or above target right now.",
      actualLabel: "Actual", targetLabel: "Target", statusLabel: "Status", open: "open",
      langToggleLabel: "Language",
    },
    days: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
    months: { mar: "Mar", apr: "Apr", may: "May", jun: "Jun", jul: "Jul", aug: "Aug" },
    monthsFull: { aug: "Aug" },
  },

  es: {
    brand: { name: "La Abuela", tagline: "Laguna de Apoyo, Nicaragua · Panel Ejecutivo" },
    sampleBadge: "Datos de muestra",
    asOf: (date) => `Actualizado: ${date}`,
    nav: {
      overview: { label: "Resumen", short: "Resumen" },
      hotel: { label: "Hotel", short: "Hotel" },
      restaurant: { label: "Restaurante", short: "Rest." },
      financials: { label: "Financiero", short: "Finanzas" },
      operations: { label: "Operaciones", short: "Oper." },
      scorecard: { label: "Tablero", short: "Punt." },
    },
    intros: {
      overview: { eyebrow: "Toda la propiedad", title: "Resumen", note: "Una primera mirada a habitaciones, restaurante y caja del día y del mes en curso." },
      hotel: { eyebrow: "Habitaciones", title: "Hotel", note: "Ocupación, tarifa y desempeño de estadías en las 16 habitaciones." },
      restaurant: { eyebrow: "Alimentos y bebidas", title: "Restaurante", note: "Comensales, cuentas y costo de alimentos de la cocina junto al lago." },
      financials: { eyebrow: "Dinero", title: "Financiero", note: "Ingresos frente al presupuesto, posición de caja y destino de los gastos." },
      operations: { eyebrow: "Detrás de escena", title: "Operaciones", note: "Personal, mantenimiento y las métricas de sostenibilidad que le importan a La Abuela." },
      scorecard: { eyebrow: "Revisión mensual", title: "Tablero", note: "Todos los indicadores clave, meta frente a real, en un solo lugar — el marco para la revisión mensual de propietarios." },
    },
    kpi: {
      ov_todayRev: { label: "Ingresos de Hoy", sub: "vs. $2,940 mismo día sem. pasada" },
      ov_mtdRev: { label: "Ingresos del Mes", sub: "90% del presupuesto del mes" },
      ov_occupancy: { label: "Ocupación", sub: "11 de 16 habitaciones vendidas hoy" },
      ov_adr: { label: "Tarifa Promedio (ADR)", sub: "Tarifa diaria promedio" },
      ov_restRev: { label: "Ingresos de Restaurante (Mes)", sub: "64 comensales hoy" },
      ov_cashCollected: { label: "Efectivo Cobrado (Mes)", sub: "$4,420 pendiente" },
      ht_roomsSold: { label: "Habitaciones Vendidas Hoy", sub: "de 16 habitaciones totales" },
      ht_occupancy: { label: "Ocupación", sub: "Últimos 7 días: 74%" },
      ht_adr: { label: "Tarifa Promedio (ADR)", sub: "+$7 vs. meta" },
      ht_revpar: { label: "RevPAR", sub: "Ingreso por habitación disponible" },
      ht_los: { label: "Estadía Promedio", sub: "noches por reserva" },
      ht_ooo: { label: "Fuera de Servicio", sub: "Casita 4 — plomería" },
      rs_covers: { label: "Comensales Hoy", sub: "Desayuno, almuerzo y cena" },
      rs_avgCheck: { label: "Cuenta Promedio", sub: "Por comensal" },
      rs_foodCost: { label: "% Costo de Alimentos", sub: "Mes, sobre ingresos de alimentos" },
      rs_restRevMtd: { label: "Ingresos de Restaurante (Mes)", sub: "vs. presupuesto mensual" },
      fi_mtdRev: { label: "Ingresos del Mes", sub: "Habitaciones + A&B + otros" },
      fi_mtdExpense: { label: "Gastos del Mes", sub: "Directos + generales" },
      fi_ebitda: { label: "Margen EBITDA", sub: "Últimos 30 días" },
      fi_ar: { label: "Cuentas por Cobrar", sub: "OTA + cuentas corporativas" },
      fi_ap: { label: "Cuentas por Pagar", sub: "Vencen en 30 días" },
      fi_cash: { label: "Efectivo Cobrado (Mes)", sub: "vs. ingresos facturados" },
      op_staff: { label: "Personal Programado Hoy", sub: "En todos los departamentos" },
      op_tickets: { label: "Tickets de Mantenimiento Abiertos", sub: "2 marcados de alta prioridad" },
      op_energyCost: { label: "Costo de Energía (Mes)", sub: "Red + generador de respaldo" },
      op_waterUse: { label: "Uso de Agua / Huésped-Noche", sub: "Promedio de los últimos 7 días" },
    },
    sections: {
      revenue30d: { title: "Ingresos de 30 Días", eyebrow: "Tendencia" },
      occupancyTrend: { title: "Tendencia de Ocupación", eyebrow: "Tendencia · meta 75%" },
      hotelVsRestaurant: { title: "Ingresos: Hotel vs. Restaurante", eyebrow: "Últimos 7 días" },
      roomTypeOcc: { title: "Ocupación por Tipo de Habitación", eyebrow: "Hoy" },
      arrivalsDepartures: { title: "Llegadas y Salidas", eyebrow: "Recepción" },
      mealPeriod: { title: "Ingresos por Turno", eyebrow: "Hoy" },
      topItems: { title: "Platos Más Vendidos", eyebrow: "Esta semana, por ingresos" },
      revenueVsBudget: { title: "Ingresos vs. Presupuesto", eyebrow: "Últimos 6 meses · *mes en curso" },
      expenseBreakdown: { title: "Desglose de Gastos", eyebrow: "Mes en curso" },
      sustainability: { title: "Sostenibilidad", eyebrow: "Promedio de los últimos 7 días" },
      tickets: { title: "Tickets de Mantenimiento Abiertos" },
      needsAttention: { title: "Requiere Atención", eyebrow: "Señales" },
    },
    chart: { thirtyDaysAgo: "Hace 30 días", today: "Hoy", hotel: "Hotel", restaurant: "Restaurante", actual: "Real", budget: "Presupuesto" },
    roomTypes: { lagoonCasita: "Casita Vista al Lago", gardenBungalow: "Bungaló del Jardín", familySuite: "Suite Familiar" },
    mealPeriods: { breakfast: "Desayuno", lunch: "Almuerzo", dinner: "Cena" },
    menuItems: { ceviche: "Ceviche de Laguna", nacatamal: "Nacatamal", vigoron: "Vigorón", rondon: "Rondón", cacaoFlight: "Flight de Cacao y Café" },
    expenseNames: { payroll: "Nómina", fbCost: "Costo A&B", utilities: "Servicios y Energía", maintenance: "Mantenimiento", otherOverhead: "Otros Gastos Generales" },
    sustainNames: { solarShare: "Energía Solar", wasteDiverted: "Residuos Desviados del Vertedero", waterVsTarget: "Uso de Agua vs. Meta" },
    ticketNames: {
      t1: "Casita 4 — plomería del baño", t2: "Inversor solar #2 — código de falla",
      t3: "Bungaló 3 — puerta mosquitera", t4: "Iluminación del muelle — reinicio de temporizador",
    },
    priority: { high: "Alta", medium: "Media", low: "Baja" },
    scorecardMetrics: {
      occupancy: "Ocupación", adr: "ADR", revpar: "RevPAR", restRevMtd: "Ingresos de Restaurante (Mes)",
      foodCost: "% Costo de Alimentos", ebitda: "Margen EBITDA", cashCollected: "Efectivo Cobrado (Mes)",
      solarShare: "Energía Solar", waterUse: "Uso de Agua / Huésped-Noche", wasteDiverted: "Residuos Desviados",
    },
    status: { good: "En meta", watch: "Atención", bad: "Bajo meta" },
    misc: {
      arriving: "Llegan", departing: "Salen", target: "Meta", metric: "Indicador",
      category: "Categoría", allOnTrack: "Todos los indicadores están en meta o por encima en este momento.",
      actualLabel: "Real", targetLabel: "Meta", statusLabel: "Estado", open: "abiertos",
      langToggleLabel: "Idioma",
    },
    days: { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" },
    months: { mar: "Mar", apr: "Abr", may: "May", jun: "Jun", jul: "Jul", aug: "Ago" },
    monthsFull: { aug: "ago" },
  },
};

const LangContext = createContext({ lang: "en", t: STRINGS.en, setLang: () => {} });
const useLang = () => useContext(LangContext);

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

const LOWER_IS_BETTER = new Set(["fi_mtdExpense", "rs_foodCost", "ht_ooo", "op_tickets", "fi_ar", "op_waterUse"]);

function statusFromTarget(kpi) {
  if (kpi.target == null) return "good";
  const { id, value, target } = kpi;
  const lowerIsBetter = LOWER_IS_BETTER.has(id);
  const ratio = lowerIsBetter ? target / (value || 0.0001) : value / (target || 0.0001);
  if (ratio >= 1) return "good";
  if (ratio >= 0.9) return "watch";
  return "bad";
}

const STATUS_COLOR = { good: "var(--forest-light)", watch: "var(--gold)", bad: "var(--terracotta-dark)" };

/* ============================================================================
   PRIMITIVE UI COMPONENTS
   ========================================================================== */

function TrendGlyph({ trend, size = 13 }) {
  if (trend === "up") return <ArrowUpRight size={size} strokeWidth={2.4} />;
  if (trend === "down") return <ArrowDownRight size={size} strokeWidth={2.4} />;
  return <Minus size={size} strokeWidth={2.4} />;
}

function KPICard({ kpi }) {
  const { t } = useLang();
  const status = statusFromTarget(kpi);
  const copy = t.kpi[kpi.id] || { label: kpi.id, sub: "" };
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{copy.label}</span>
        <span className="status-dot" style={{ background: STATUS_COLOR[status] }} title={t.status[status]} />
      </div>
      <div className="kpi-value">{formatValue(kpi.value, kpi.format)}</div>
      <div className={"kpi-sub trend-" + kpi.trend}>
        <TrendGlyph trend={kpi.trend} />
        <span>{copy.sub}</span>
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
  const { t } = useLang();
  const flagged = items.filter((k) => statusFromTarget(k) !== "good");
  const s = t.sections.needsAttention;
  if (flagged.length === 0) {
    return (
      <SectionCard title={s.title} eyebrow={s.eyebrow}>
        <p className="muted-note">{t.misc.allOnTrack}</p>
      </SectionCard>
    );
  }
  return (
    <SectionCard title={s.title} eyebrow={s.eyebrow}>
      <div className="attention-list">
        {flagged.map((k) => {
          const status = statusFromTarget(k);
          const copy = t.kpi[k.id] || { label: k.id };
          return (
            <div className="attention-row" key={k.id}>
              <TriangleAlert size={16} strokeWidth={2} color={STATUS_COLOR[status]} />
              <div className="attention-text">
                <span className="attention-label">{copy.label}</span>
                <span className="attention-meta">
                  {t.misc.actualLabel} {formatValue(k.value, k.format)} · {t.misc.targetLabel} {formatValue(k.target, k.format)}
                </span>
              </div>
              <span className="pill" style={{ borderColor: STATUS_COLOR[status], color: STATUS_COLOR[status] }}>
                {t.status[status]}
              </span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ---------- Custom SVG charts (styled to brand, no default chart-lib look) --------- */

function LineChartSVG({ data, color = "var(--forest)", target, height = 220 }) {
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

function GroupedBarChart({ data, keys, colors, labels, height = 220 }) {
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
          <g key={gi}>
            {keys.map((k, ki) => {
              const val = d[k];
              const barH = (val / max) * innerH;
              const x = groupX + groupW / 2 - (keys.length * barW) / 2 + ki * barW + 3;
              const y = pad.top + innerH - barH;
              return <rect key={k} x={x} y={y} width={barW - 6} height={barH} rx="3" fill={colors[ki]} />;
            })}
            <text x={groupX + groupW / 2} y={height - 6} textAnchor="middle" className="chart-axis-label">
              {labels[gi]}
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
      {rows.map((r, i) => (
        <div className="hbar-row" key={i}>
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

function ProgressRing({ value, size = 84, color = "var(--forest)", label, sub }) {
  const r = (size - 9) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9"
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

function PageIntro({ page }) {
  const { t } = useLang();
  const s = t.intros[page];
  return (
    <div className="page-intro">
      <span className="eyebrow">{s.eyebrow}</span>
      <h2>{s.title}</h2>
      <p>{s.note}</p>
    </div>
  );
}

function ChartFoot() {
  const { t } = useLang();
  return (
    <div className="chart-foot">
      <span>{t.chart.thirtyDaysAgo}</span><span>{t.chart.today}</span>
    </div>
  );
}

function formatDate(day, month, t) {
  return `${t.monthsFull[month] || month} ${day}`;
}

/* ============================================================================
   PAGE: OVERVIEW
   ========================================================================== */

function OverviewPage({ data }) {
  const { t } = useLang();
  return (
    <div className="page">
      <PageIntro page="overview" />
      <div className="kpi-grid">
        {data.kpis.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>

      <div className="chart-grid">
        <SectionCard title={t.sections.revenue30d.title} eyebrow={t.sections.revenue30d.eyebrow}>
          <LineChartSVG data={data.revenue30d.map((v, i) => ({ label: i, value: v }))} color="var(--forest)" />
          <ChartFoot />
        </SectionCard>
        <SectionCard title={t.sections.occupancyTrend.title} eyebrow={t.sections.occupancyTrend.eyebrow}>
          <LineChartSVG data={data.occupancy30d.map((v, i) => ({ label: i, value: v }))} color="var(--terracotta)" target={data.occTarget} />
          <ChartFoot />
        </SectionCard>
      </div>

      <div className="chart-grid">
        <SectionCard title={t.sections.hotelVsRestaurant.title} eyebrow={t.sections.hotelVsRestaurant.eyebrow} className="span-2">
          <GroupedBarChart
            data={data.hotelVsRestaurant7d}
            keys={["hotel", "restaurant"]}
            colors={["var(--forest)", "var(--terracotta)"]}
            labels={data.hotelVsRestaurant7d.map((d) => t.days[d.day])}
          />
          <div className="legend-row">
            <span className="legend-item"><i style={{ background: "var(--forest)" }} />{t.chart.hotel}</span>
            <span className="legend-item"><i style={{ background: "var(--terracotta)" }} />{t.chart.restaurant}</span>
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
  const { t } = useLang();
  return (
    <div className="page">
      <PageIntro page="hotel" />
      <div className="kpi-grid">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title={t.sections.roomTypeOcc.title} eyebrow={t.sections.roomTypeOcc.eyebrow}>
          <HBarList
            rows={data.roomTypes.map((r) => ({ label: `${t.roomTypes[r.id]} (${r.rooms})`, value: r.occupancy }))}
            max={100}
            colorVar="var(--forest)"
            valueFormat={(v) => v + "%"}
          />
        </SectionCard>
        <SectionCard title={t.sections.arrivalsDepartures.title} eyebrow={t.sections.arrivalsDepartures.eyebrow}>
          <div className="list-block">
            <p className="list-heading">{t.misc.arriving}</p>
            {data.arrivals.map((a, i) => (
              <div className="list-row" key={i}>
                <span>{a.guest}</span>
                <span className="muted">{t.roomTypes[a.roomTypeId]} · {a.nights}n</span>
                <span className="muted">{formatDate(a.day, a.month, t)}</span>
              </div>
            ))}
            <p className="list-heading" style={{ marginTop: 12 }}>{t.misc.departing}</p>
            {data.departures.map((d, i) => (
              <div className="list-row" key={i}>
                <span>{d.guest}</span>
                <span className="muted">{t.roomTypes[d.roomTypeId]}</span>
                <span className="muted">{formatDate(d.day, d.month, t)}</span>
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
  const { t } = useLang();
  return (
    <div className="page">
      <PageIntro page="restaurant" />
      <div className="kpi-grid kpi-grid-4">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title={t.sections.mealPeriod.title} eyebrow={t.sections.mealPeriod.eyebrow}>
          <HBarList
            rows={data.mealPeriods.map((m) => ({ label: t.mealPeriods[m.id], value: m.revenue }))}
            colorVar="var(--terracotta)"
            valueFormat={(v) => "$" + v}
          />
        </SectionCard>
        <SectionCard title={t.sections.topItems.title} eyebrow={t.sections.topItems.eyebrow}>
          <HBarList
            rows={data.topItems.map((m) => ({ label: t.menuItems[m.id], value: m.revenue }))}
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
  const { t } = useLang();
  const maxExpense = Math.max(...data.expenseBreakdown.map((e) => e.value));
  return (
    <div className="page">
      <PageIntro page="financials" />
      <div className="kpi-grid">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title={t.sections.revenueVsBudget.title} eyebrow={t.sections.revenueVsBudget.eyebrow}>
          <GroupedBarChart
            data={data.revenueVsBudget6mo}
            keys={["actual", "budget"]}
            colors={["var(--forest)", "var(--gold-light)"]}
            labels={data.revenueVsBudget6mo.map((d) => t.months[d.month] + (d.current ? "*" : ""))}
          />
          <div className="legend-row">
            <span className="legend-item"><i style={{ background: "var(--forest)" }} />{t.chart.actual}</span>
            <span className="legend-item"><i style={{ background: "var(--gold-light)" }} />{t.chart.budget}</span>
          </div>
        </SectionCard>
        <SectionCard title={t.sections.expenseBreakdown.title} eyebrow={t.sections.expenseBreakdown.eyebrow}>
          <HBarList
            rows={data.expenseBreakdown.map((e) => ({ label: t.expenseNames[e.id], value: e.value }))}
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
  const { t } = useLang();
  const iconMap = { sun: Sun, leaf: Leaf, droplet: Droplets };
  return (
    <div className="page">
      <PageIntro page="operations" />
      <div className="kpi-grid kpi-grid-4">
        {data.stats.map((k) => <KPICard kpi={k} key={k.id} />)}
      </div>
      <div className="chart-grid">
        <SectionCard title={t.sections.sustainability.title} eyebrow={t.sections.sustainability.eyebrow}>
          <div className="ring-row">
            {data.sustainability.map((s) => {
              const color = s.value >= s.target ? "var(--forest-light)" : "var(--terracotta)";
              return (
                <ProgressRing
                  key={s.id}
                  value={s.value}
                  color={color}
                  label={t.sustainNames[s.id]}
                  sub={`${t.misc.target} ${s.target}%`}
                />
              );
            })}
          </div>
        </SectionCard>
        <SectionCard title={t.sections.tickets.title} eyebrow={`${data.tickets.length} ${t.misc.open}`}>
          <div className="list-block">
            {data.tickets.map((tk) => (
              <div className="list-row" key={tk.id}>
                <span className="ticket-icon"><Wrench size={14} strokeWidth={2} /></span>
                <span style={{ flex: 1 }}>{t.ticketNames[tk.id]}</span>
                <span className={"priority-pill priority-" + tk.priority}>{t.priority[tk.priority]}</span>
                <span className="muted">{formatDate(tk.day, tk.month, t)}</span>
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
  const { t } = useLang();
  const categories = [...new Set(rows.map((r) => r.category))];
  return (
    <div className="page">
      <PageIntro page="scorecard" />
      {categories.map((cat) => (
        <SectionCard title={t.nav[cat].label} key={cat} eyebrow={t.misc.category}>
          <div className="score-table">
            <div className="score-row score-head">
              <span>{t.misc.metric}</span><span>{t.misc.target}</span><span>{t.misc.actualLabel}</span><span>{t.misc.statusLabel}</span>
            </div>
            {rows.filter((r) => r.category === cat).map((r) => (
              <div className="score-row" key={r.id}>
                <span>{t.scorecardMetrics[r.id]}</span>
                <span className="mono">{r.target}</span>
                <span className="mono">{r.actual}</span>
                <span className="pill" style={{ borderColor: STATUS_COLOR[r.status], color: STATUS_COLOR[r.status] }}>
                  {t.status[r.status]}
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
   APP SHELL
   ========================================================================== */

export default function App() {
  const [tab, setTab] = useState("overview");
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];

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
  }, [tab, lang]);

  const asOfStr = `${formatDate(DATA.meta.asOfDay, DATA.meta.asOfMonth, t)} · ${DATA.meta.asOfTime}`;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
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
          .top-meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
          .top-meta-row { display: flex; align-items: center; gap: 10px; }
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
            white-space: nowrap;
          }
          .as-of { font-size: 12px; color: rgba(243,237,222,0.6); }

          .lang-toggle {
            display: inline-flex;
            border: 1px solid rgba(228,201,143,0.4);
            border-radius: 20px;
            padding: 2px;
            background: rgba(22,40,31,0.35);
          }
          .lang-toggle button {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
            padding: 4px 11px;
            border-radius: 16px;
            border: none;
            background: transparent;
            color: rgba(243,237,222,0.55);
            cursor: pointer;
            transition: background 0.15s ease, color 0.15s ease;
          }
          .lang-toggle button.active {
            background: var(--gold);
            color: var(--forest-deep);
          }

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
            .top-meta { align-items: flex-end; }
          }
          @media (max-width: 480px) {
            .kpi-grid, .kpi-grid-4 { grid-template-columns: 1fr 1fr; gap: 10px; }
            .score-row { grid-template-columns: 1.6fr 0.9fr 0.9fr 0.9fr; font-size: 12px; }
            .ring-row { gap: 12px; }
            .ring-wrap { width: 96px; }
            .top-bar-inner { flex-direction: column; }
            .top-meta { align-items: flex-start; width: 100%; }
            .top-meta-row { width: 100%; justify-content: space-between; }
          }
        `}</style>

        <header className="top-bar">
          <ContourWatermark />
          <div className="top-bar-inner">
            <div className="brand-block">
              <h1>{t.brand.name}</h1>
              <p>{t.brand.tagline}</p>
            </div>
            <div className="top-meta">
              <div className="top-meta-row">
                <span className="sample-badge">{t.sampleBadge}</span>
                <div className="lang-toggle" role="group" aria-label={t.misc.langToggleLabel}>
                  <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
                  <button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>ES</button>
                </div>
              </div>
              <span className="as-of">{t.asOf(asOfStr)}</span>
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
                  {t.nav[n.id].label}
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
                  <span>{t.nav[n.id].short}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </LangContext.Provider>
  );
}
