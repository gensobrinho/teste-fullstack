import { useState } from "react";
import { useFaturamentoSendData } from "../hooks/useFaturamentoSendData";
import { useLoadFaturamento } from "../hooks/useLoadFaturamento";
import { FaturamentoRequestDTO } from "../types/FaturamentoRequestDTO";
import { FaturamentoResponseDTO } from "../types/FaturamentoResponseDTO";

export default function FaturamentoPage() {
  const [comp, setComp] = useState("2025-08");
  const [selectedFaturaId, setSelectedFaturaId] = useState<string | null>(null);
  const { faturasData, placasData, isLoading, refetchFaturas } = 
    useLoadFaturamento(comp, selectedFaturaId);
  const { createFatura } = useFaturamentoSendData();

  const handleCreate = (comp: string) => {
    const body: FaturamentoRequestDTO = {
      competencia: comp,
    };
    createFatura(body);
    refetchFaturas();
  };

  const handleTogglePlacas = (faturaId: string) => {
    if (selectedFaturaId === faturaId) {
      setSelectedFaturaId(null);
    } else {
      setSelectedFaturaId(faturaId);
    }
  };

  const renderRow = (fatura: FaturamentoResponseDTO) => {
    const isShowingPlacas = selectedFaturaId === fatura.id;
    return (
      <tr key={fatura.id}>
        <td>{fatura.clienteId}</td>
        <td>{fatura.competencia}</td>
        <td>{Number(fatura.valor).toFixed(2)}</td>
        <td>{fatura.qtdVeiculos}</td>
        <td>
          <button
            className="btn-ghost"
            onClick={() => handleTogglePlacas(fatura.id)}
          >
            {isShowingPlacas ? "ocultar" : "detalhar"}
          </button>
          {isShowingPlacas && (
            <div style={{ marginTop: 6 }}>
              {isLoading ? "Carregando..." : placasData?.join(", ") || ""}
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderTable = () => {
    if (isLoading) {
      return <p>Carregando...</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Competência</th>
            <th>Valor</th>
            <th>Qtd Veículos</th>
            <th>Placas</th>
          </tr>
        </thead>
        <tbody>
          {faturasData?.map((f: FaturamentoResponseDTO) => renderRow(f))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Faturamento</h2>

      <div className="section">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={comp}
            onChange={(e) => setComp(e.target.value)}
            placeholder="yyyy-MM"
          />
          <button onClick={() => handleCreate(comp)}>Gerar faturas</button>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Faturas</h3>
      <div className="section">
        {renderTable()}
        <p className="note">
          BUG proposital: API associa veículos pelo dono atual, e não pelo dono
          na data de corte.
        </p>
      </div>
    </div>
  );
}