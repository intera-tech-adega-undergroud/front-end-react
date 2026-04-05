import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import avatarPadrao from '../assets/avatarPadrao.svg'
import './Dashboard.css'

const chartData = [
  { dia: 1, valor: 2300 },
  { dia: 2, valor: 3150 },
  { dia: 3, valor: 1800 },
  { dia: 4, valor: 4100 },
  { dia: 5, valor: 3650 },
  { dia: 6, valor: 2900 },
  { dia: 7, valor: 2600 },
  { dia: 8, valor: 4450 },
  { dia: 9, valor: 3800 },
  { dia: 10, valor: 3350 },
  { dia: 11, valor: 4700 },
  { dia: 12, valor: 5250 },
  { dia: 13, valor: 3900 },
  { dia: 14, valor: 6100 },
  { dia: 15, valor: 4300 },
  { dia: 16, valor: 5200 },
  { dia: 17, valor: 2800 },
  { dia: 18, valor: 4900 },
  { dia: 19, valor: 3450 },
  { dia: 20, valor: 5600 },
  { dia: 21, valor: 4100 },
]

const rankingData = [
  { nome: 'E. Menezes', valor: 'R$ 6.228', avatar: avatarPadrao },
  { nome: 'A. Santos', valor: 'R$ 4.233', avatar: avatarPadrao },
]

const currencyFormatter = (valor) => `R$ ${Number(valor).toLocaleString('pt-BR')}`

function MonthTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="middle" fill="#A8B0B9" fontSize="10">
        {payload.value}
      </text>
      <text x={0} y={0} dy={22} textAnchor="middle" fill="#77808A" fontSize="9">
        Set
      </text>
    </g>
  )
}

function DashboardPage() {
  return (
    <section className="dashboard-screen">
      <h1 className="dashboard-page-title">Dashboard</h1>

      <section className="dashboard-metrics">
        <article className="dashboard-card metric-card">
          <p className="metric-title">Vendas do Mes</p>
          <h2 className="metric-value">R$ 12.870</h2>
          <p className="metric-subtext">
            <TrendingUp size={14} />
            977 vendidos
          </p>
        </article>

        <article className="dashboard-card metric-card">
          <p className="metric-title">Faturamento do Dia</p>
          <h2 className="metric-value">R$ 690</h2>
          <p className="metric-subtext">
            <TrendingUp size={14} />
            56 produtos vendidos
          </p>
        </article>

        <article className="dashboard-card metric-card metric-ranking">
          <p className="metric-title">Ranking por Vendedor</p>
          <ul className="top-ranking-list">
            {rankingData.map((vendedor) => (
              <li key={vendedor.nome}>
                <div className="ranking-profile">
                  <img src={vendedor.avatar} alt={`Avatar de ${vendedor.nome}`} />
                  <span>{vendedor.nome}</span>
                </div>
                <div className="ranking-status">
                  <strong>{vendedor.valor}</strong>
                  <TrendingUp size={14} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-card filter-section">
        <label className="filter-block">
          <span>Metrica</span>
          <select defaultValue="totais">
            <option value="totais">Vendas Totais</option>
            <option value="lucro">Lucro Apenas</option>
          </select>
        </label>

        <label className="filter-block">
          <span>Periodo</span>
          <select defaultValue="este-mes">
            <option value="este-mes">Este Mes</option>
            <option value="mes-passado">Mes Passado</option>
            <option value="trimestral">Trimestral</option>
          </select>
        </label>

        <label className="filter-block">
          <span>Data Personalizada</span>
          <input type="text" defaultValue="05/07/2023 - 23/01/2023" />
        </label>
      </section>

      <section className="dashboard-card detailed-chart-card">
        <h2 className="detailed-chart-title">Visao Detalhada de Vendas Diarias (Este Mes)</h2>
        <div className="detailed-chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -14, bottom: 26 }}>
              <CartesianGrid vertical={false} stroke="#242A31" strokeDasharray="4 4" />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={<MonthTick />} interval={0} />
              <YAxis
                domain={[0, 7000]}
                ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000]}
                stroke="#8F98A3"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{
                  background: '#101317',
                  border: '1px solid #2B3139',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                }}
                formatter={(value) => [currencyFormatter(value), 'Vendas do Dia']}
                labelFormatter={(label) => `Dia ${label} - Set`}
              />
              <Bar dataKey="valor" fill="#3EDC67" radius={[8, 8, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      </div>
    </section>
  )
}

export default DashboardPage
