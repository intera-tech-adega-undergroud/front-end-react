import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import avatarPadrao from '../assets/avatarPadrao.svg'
import './Dashboard.css'


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

function formatDateBr(dataIso) {
  if (!dataIso) return '--/--/----'
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}

function DashboardPage() {
  // Armazenamento de token JWT
  const token = localStorage.getItem('tokenAdega')

  // Dados obtidos
  const [chartData, setChartData] = useState([])
  const [rankingData, setRankingData] = useState([])

  const [vendasMes, setVendasMes] = useState(null)
  const [faturamentoDia, setFaturamentoDia] = useState(null)

  // Variaveis de filtros
  const [metrica, setMetrica] = useState('totais')

  const [periodo, setPeriodo] = useState('este-mes')

  const [startDate, setStartDate] = useState('2026-05-01')

  const [endDate, setEndDate] = useState('2026-05-31')

  // Funções com requisições na API

  // Dashboard
  const buscarGrafico = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/eventos/grafico-dashboard?dataInicio=${startDate}&dataFim=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 204) {
        setChartData([])
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar gráfico')
      }

      const dados = await response.json()

      const dadosFormatados = dados.map(item => ({
        dia: item.dia,
        valor: item.valorTotalVendas
      }))

      setChartData(dadosFormatados)

    } catch (erro) {

      console.error(erro)
    }
  }

  // Ranking
  const buscarRanking = async () => {

    try {

      const response = await fetch(
        'http://localhost:8080/eventos/ranking-funcionarios',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 204) {
        setRankingData([])
        return
      }

      const dados = await response.json()

      const rankingFormatado = dados.map(item => ({
        nome: item.vendedor,
        valor: `R$ ${item.valorTotalVendido.toLocaleString('pt-BR')}`,
        avatar: avatarPadrao
      }))

      setRankingData(rankingFormatado)

    } catch (erro) {

      console.error(erro)
    }
  }

  // Vendas Mês
  const buscarVendasMes = async () => {

    try {

      const response = await fetch(
        'http://localhost:8080/eventos/vendas-mes',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 204) {
        return
      }

      const dados = await response.json()

      setVendasMes(dados)

    } catch (erro) {

      console.error(erro)
    }
  }

  // Faturamento dia
  const buscarFaturamentoDia = async () => {

    try {

      const response = await fetch(
        'http://localhost:8080/eventos/faturamento-dia',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 204) {
        return
      }

      const dados = await response.json()

      setFaturamentoDia(dados)

    } catch (erro) {

      console.error(erro)
    }
  }

  // Chamada de funções assim que a página carrega
  useEffect(() => {

    buscarGrafico()

    buscarRanking()

    buscarVendasMes()

    buscarFaturamentoDia()

  }, [])

  // Chamada de função ao alterar filtros
  useEffect(() => {

    if (!startDate || !endDate) return

    if (new Date(startDate) > new Date(endDate)) {
      return
    }

    buscarGrafico()

  }, [startDate, endDate])

  // Obter periodo
  useEffect(() => {

  const hoje = new Date()

  let inicio
  let fim

  switch (periodo) {

    case 'este-mes':

      inicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      )

      fim = hoje

      break

    case 'mes-passado':

      inicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 1,
        1
      )

      fim = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        0
      )

      break

    case 'esta-semana': {

      const primeiroDiaSemana =
        hoje.getDate() - hoje.getDay()

      inicio = new Date(hoje)

      inicio.setDate(primeiroDiaSemana)

      fim = hoje

      break
    }

    case 'semana-passada': {

      const primeiroDiaSemana =
        hoje.getDate() - hoje.getDay()

      inicio = new Date(hoje)

      inicio.setDate(
        primeiroDiaSemana - 7
      )

      fim = new Date(hoje)

      fim.setDate(
        primeiroDiaSemana - 1
      )

      break
    }

    case 'trimestral':

      inicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 3,
        hoje.getDate()
      )

      fim = hoje

      break

    default:
      return
  }

  setStartDate(
    inicio.toISOString().split('T')[0]
  )

  setEndDate(
    fim.toISOString().split('T')[0]
  )

}, [periodo])

  const currencyFormatter = (valor) => `R$ ${Number(valor).toLocaleString('pt-BR')}`

  const openNativeDatePicker = (event) => {
    if (event.currentTarget.showPicker) {
      event.currentTarget.showPicker()
    }
  }

  return (
    <section className="dashboard-screen">
      <h1 className="dashboard-page-title">Dashboard</h1>

      <section className="dashboard-metrics">
        <article className="dashboard-card metric-card">
          <p className="metric-title">Vendas do Mes</p>
          <h2 className="metric-value">
            {vendasMes
              ? `R$ ${vendasMes.valorTotalVendido.toLocaleString('pt-BR')}`
              : 'R$ 0'}
          </h2>
          <p className="metric-subtext">
            <TrendingUp size={14} />
            {vendasMes?.totalVendas || 0} vendidos
          </p>
        </article>

        <article className="dashboard-card metric-card">
          <p className="metric-title">Faturamento do Dia</p>
          <h2 className="metric-value">{faturamentoDia
              ? `R$ ${faturamentoDia.valorTotalVendido.toLocaleString('pt-BR')}`
              : 'R$ 0'}</h2>
          <p className="metric-subtext">
            <TrendingUp size={14} />
            {faturamentoDia?.totalVendas || 0} vendidos
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
          <select value={metrica} onChange={(event) => setMetrica(event.target.value)}>
            <option value="totais">Vendas Totais</option>
            <option value="lucro">Lucro Apenas</option>
          </select>
        </label>

        <label className="filter-block">
          <span>Periodo</span>
          <select value={periodo} onChange={(event) => setPeriodo(event.target.value)}>
            <option value="este-mes">Este Mes</option>
            <option value="mes-passado">Mes Passado</option>
            <option value="esta-semana">Esta Semana</option>
            <option value="semana-passada">Semana Passada</option>
            <option value="trimestral">Trimestral</option>
          </select>
        </label>

        <div className="date-range-fields">
          <label className="date-input-row">
            <span>De</span>
            <input
              type="date"
              value={startDate}
              onClick={openNativeDatePicker}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label className="date-input-row">
            <span>Ate</span>
            <input
              type="date"
              value={endDate}
              onClick={openNativeDatePicker}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="dashboard-card detailed-chart-card">
        <h2 className="detailed-chart-title">Visao Detalhada de Vendas Diarias (Este Mes)</h2>
        <div className="detailed-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 14, right: 10, left: -14, bottom: 10 }}>
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
    </section>
  )
}

export default DashboardPage
