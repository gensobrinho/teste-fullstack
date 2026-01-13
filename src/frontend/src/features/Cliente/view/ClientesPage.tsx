import { useState } from "react";
import { useLoadCliente } from "../hooks/useLoadCliente";
import { useClienteSendData } from "../hooks/useClienteSendData";
import { Cliente } from "../../../shared/types";

export default function ClientesPage() {
  const [filtro, setFiltro] = useState("");
  const [mensalista, setMensalista] = useState("all");
  const [form, setForm] = useState<Partial<Cliente>>({
    nome: "",
    telefone: "",
    endereco: "",
    mensalista: false,
    valorMensalidade: 0,
  });
  const { data: clientes, loading } = useLoadCliente(filtro, mensalista);
  const { createCliente, deleteCliente } = useClienteSendData();

  const handleCreate = () => {
    if (!form.nome || !form.telefone) return;
    createCliente(form);
  };

  const handleDelete = (id: string) => {
    deleteCliente(id);
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
          {clientes?.itens?.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.telefone}</td>
              <td>{c.mensalista ? "Sim" : "Não"}</td>
              <td>
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

      <h3>Novo cliente</h3>
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
          <button onClick={() => handleCreate()}>Salvar</button>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Lista</h3>
      <div className="section">{renderTable()}</div>
    </div>
  );
}
