import { useState } from "react";
import { useLoadCliente } from "../hooks/useLoadCliente";
import { useClienteSendData } from "../hooks/useClienteSendData";
import { Cliente } from "../../../shared/types";
import { ClienteUpdateDTO } from "../types/ClienteUpdateDTO";

export default function ClientesPage() {
  const [filtro, setFiltro] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [mensalista, setMensalista] = useState("all");
  const [form, setForm] = useState<Partial<Cliente>>({
    nome: "",
    telefone: "",
    endereco: "",
    mensalista: false,
    valorMensalidade: 0,
  });
  const { data: clientes, loading } = useLoadCliente(filtro, mensalista);
  const { createCliente, deleteCliente, updateCliente } = useClienteSendData();

  const resetForm = () => {
    setForm({
      nome: "",
      telefone: "",
      endereco: "",
      mensalista: false,
      valorMensalidade: 0,
    });
    setEditId(null);
    setError("");
  };

  const handleCreate = () => {
    if (!form.nome || !form.telefone) {
      setError("Nome e Telefone são obrigatórios.");
      return;
    }
    setError("");

    createCliente(form, {
      onSuccess: () => resetForm(),
      onError: (error: Error) => {
        const errorMessage = error.message || "Erro ao criar cliente.";
        setError(errorMessage);
      },
    });
  };

  const handleUpdate = () => {
    if (!editId) {
      return;
    }
    
    if (!form.nome || !form.telefone) {
      setError("Nome e Telefone são obrigatórios.");
      return;
    }
    setError("");

    const body: ClienteUpdateDTO = {
      id: editId,
      data: form,
    };

    updateCliente(body, {
      onSuccess: () => {
        resetForm();
      },
      onError: (error: Error) => {
        const errorMessage = error.message || "Erro ao atualizar cliente.";
        setError(errorMessage);
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteCliente(id);
  };

  const editForm = (cliente: Cliente) => {
    setEditId(cliente.id);
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone || "",
      endereco: cliente.endereco || "",
      mensalista: cliente.mensalista,
      valorMensalidade: cliente.valorMensalidade || 0,
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
            <th>Nome</th>
            <th>Telefone</th>
            <th>Mensalista</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes?.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.telefone}</td>
              <td>{c.mensalista ? "Sim" : "Não"}</td>
              <td>
                <button className="btn-ghost" onClick={() => editForm(c)}>
                  Editar
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => handleDelete(c.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Clientes</h2>

      <div className="section">
        <div className="grid grid-3">
          <input
            placeholder="Buscar por nome"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <select
            value={mensalista}
            onChange={(e) => setMensalista(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="true">Mensalistas</option>
            <option value="false">Não mensalistas</option>
          </select>
          <div />
        </div>
      </div>

      <h3>{editId ? "Editar cliente" : "Novo cliente"}</h3>
      <div className="section">
        <div className="grid grid-4">
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <input
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
          <input
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={form.mensalista}
              onChange={(e) =>
                setForm({ ...form, mensalista: e.target.checked })
              }
            />{" "}
            Mensalista
          </label>
          <input
            placeholder="Valor mensalidade"
            value={form.valorMensalidade}
            onChange={(e) =>
              setForm({ ...form, valorMensalidade: Number(e.target.value) })
            }
          />
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