import { useEffect, useState } from "react";
import { useLoadVeiculo, useVeiculoSendData } from "../hooks";
import { Veiculo } from "../../../shared/types";
import { VeiculoUpdateDTO } from "../types/VeiculoUpdateDTO";

export default function VeiculosPage() {
  const [clienteId, setClienteId] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<Veiculo>>({
    placa: "",
    modelo: "",
    ano: "",
    clienteId: "",
  });

  const { dataVeiculos, dataClientes, loading } = useLoadVeiculo(clienteId);
  const { createVeiculo, updateVeiculo, deleteVeiculo } = useVeiculoSendData();

  const resetForm = () => {
    setForm({
      placa: "",
      modelo: "",
      ano: "",
      clienteId: clienteId || "",
    });
    setEditId(null);
    setError("");
  };

  const handleCreate = () => {
    if (!form.placa) {
      setError("Placa é obrigatória.");
      return;
    }
    if (!form.clienteId) {
      setError("Cliente é obrigatório.");
      return;
    }
    setError("");

    const dataToSend = { ...form };
    if (dataToSend.ano && typeof dataToSend.ano === "string") {
      dataToSend.ano = Number(dataToSend.ano) || undefined;
    }
    createVeiculo(dataToSend, {
      onSuccess: () => resetForm(),
      onError: (error: Error) => {
        const errorMessage = error.message || "Erro ao criar veículo.";
        setError(errorMessage);
      },
    });
  };

  const handleUpdate = () => {
    if (!editId) {
      return;
    }

    if (!form.placa) {
      setError("Placa é obrigatória.");
      return;
    }
    if (!form.clienteId) {
      setError("Cliente é obrigatório.");
      return;
    }

    setError("");

    const dataToSend = { ...form };
    if (dataToSend.ano && typeof dataToSend.ano === "string") {
      dataToSend.ano = Number(dataToSend.ano) || undefined;
    }

    const body: VeiculoUpdateDTO = {
      id: editId,
      data: dataToSend,
    };

    updateVeiculo(body, {
      onSuccess: () => {
        resetForm();
      },
      onError: (error: Error) => {
        const errorMessage = error.message || "Erro ao atualizar veículo.";
        setError(errorMessage);
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteVeiculo(id);
  };

  const editForm = (veiculo: Veiculo) => {
    setEditId(veiculo.id);
    setForm({
      placa: veiculo.placa,
      modelo: veiculo.modelo || "",
      ano: veiculo.ano || "",
      clienteId: veiculo.clienteId,
    });
    setError("");
  };

  const renderButton = () => {
    if (error) {
      return <div style={{ color: "red", marginBottom: 8 }}>{error}</div>;
    }
    if (editId) {
      return (
        <>
          <button onClick={handleUpdate}>Atualizar</button>
          <button onClick={resetForm}>Cancelar</button>
        </>
      );
    } else {
      return <button onClick={handleCreate}>Salvar</button>;
    }
  };

  const renderTable = () => {
    if (loading) {
      return <p>Carregando...</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Cliente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dataVeiculos?.map((v) => {
            const clienteNome =
              dataClientes?.find((c) => c.id === v.clienteId)?.nome ||
              v.clienteId;
            return (
              <tr key={v.id}>
                <td>{v.placa}</td>
                <td>{v.modelo || "-"}</td>
                <td>{v.ano ?? "-"}</td>
                <td>{clienteNome}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn-ghost" onClick={() => editForm(v)}>
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
            );
          })}
        </tbody>
      </table>
    );
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
          <label>Filtrar por Cliente: </label>
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
            }}
          >
            <option value="">Todos</option>
            {dataClientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3>{editId ? "Editar veículo" : "Novo veículo"}</h3>
      <div className="section">
        <div className="grid grid-4">
          <input
            placeholder="Placa"
            value={form.placa}
            onChange={(e) => setForm({ ...form, placa: e.target.value })}
            disabled={!!editId}
          />
          <input
            placeholder="Modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          />
          <input
            placeholder="Ano"
            type="number"
            value={form.ano || ""}
            onChange={(e) =>
              setForm({
                ...form,
                ano: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <select
            value={form.clienteId || ""}
            onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
          >
            <option value="">Selecione um cliente</option>
            {dataClientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <div />
          <div />
          <div />
          {renderButton()}
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Lista</h3>
      <div className="section">{renderTable()}</div>
    </div>
  );
}