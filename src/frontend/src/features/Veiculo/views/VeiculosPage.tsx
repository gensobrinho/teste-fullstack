import { useEffect, useState } from "react";
import { useLoadVeiculo, useVeiculoSendData } from "../hooks";
import { Veiculo } from "../../../shared/types";

export default function VeiculosPage() {
  const [clienteId, setClienteId] = useState("");
  const [form, setForm] = useState<Partial<Veiculo>>({
    placa: "",
    modelo: "",
    ano: "",
    clienteId: "",
  });

  const { dataVeiculos, dataClientes,  loading } = useLoadVeiculo(clienteId);
  const { createVeiculo, updateVeiculo, deleteVeiculo } = useVeiculoSendData();

  const handleCreate = (createData: Partial<Veiculo>) => {
    const dataToSend = { ...createData };
    if (dataToSend.ano && typeof dataToSend.ano === 'string') {
      dataToSend.ano = Number(dataToSend.ano) || undefined;
    }
    createVeiculo(dataToSend);
  };

  const handleUpdate = (updateData: Partial<Veiculo>) => {
    const id = updateData.id ?? clienteId;
    const novoModelo = prompt("Novo modelo", updateData.modelo || "");
    if (novoModelo === null) {
      return
    };

    updateVeiculo(id, updateData);
  };

  const handleDelete = (id: string) => {
    deleteVeiculo(id);
  };

  useEffect(() => {
    if (dataClientes?.length && !clienteId) {
      setClienteId(dataClientes[0].id);
      setForm((f) => ({ ...f, clienteId: dataClientes[0].id }));
    }
  }, [dataClientes]);

  return (
    <div>
      <h2>Veículos</h2>

      <div className="section">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label>Cliente: </label>
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
              setForm((f) => ({ ...f, clienteId: e.target.value }));
            }}
          >
            {dataClientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3>Novo veículo</h3>
      <div className="section">
        <div className="grid grid-4">
          <input
            placeholder="Placa"
            value={form.placa}
            onChange={(e) => setForm({ ...form, placa: e.target.value })}
          />
          <input
            placeholder="Modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          />
          <input
            placeholder="Ano"
            value={form.ano}
            onChange={(e) => setForm({ ...form, ano: e.target.value })}
          />
          <button onClick={() => handleCreate(form)}>Salvar</button>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Lista</h3>
      <div className="section">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Ano</th>
                <th>ClienteId</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dataVeiculos?.map((v) => (
                <tr key={v.id}>
                  <td>{v.placa}</td>
                  <td>{v.modelo}</td>
                  <td>{v.ano ?? "-"}</td>
                  <td>{v.clienteId}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        handleUpdate(v);
                        // TODO: trocar cliente via select modal (deixo simples aqui)
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDelete(v.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="note">
          TODO: permitir troca de cliente na edição e garantir atualização sem
          recarregar a página (React Query já invalida a lista).
        </p>
      </div>
    </div>
  );
}
