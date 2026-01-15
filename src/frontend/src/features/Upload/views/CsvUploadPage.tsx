import { useEffect, useState } from "react";
import { useUploadSendData } from "../hooks/useUploadSendData";
import { UploadLog } from "../types/UploadLog";

export default function CsvUploadPage() {
  const [log, setLog] = useState<UploadLog | null>(null);
  const [error, setError] = useState<string>("");
  const { upload, data, isPending } = useUploadSendData();

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLog(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError("Selecione um arquivo CSV.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    upload(fd, {
      onSuccess: (data: UploadLog) => {
        setLog(data);
      },
      onError: (error: Error) => {
        const errorMessage = error.message || "Erro ao fazer upload do arquivo.";
        setError(errorMessage);
      },
    });
  };

  useEffect(() => {
    if (data) {
      setLog(data);
    }
  }, [data]);

  const renderResumo = () => {
    if (!log) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <strong>Processados:</strong> {log.processados}
          </div>
          <div style={{ color: "#10b981" }}>
            <strong>Inseridos:</strong> {log.inseridos}
          </div>
          <div style={{ color: log.erros.length > 0 ? "#ef4444" : "#10b981" }}>
            <strong>Erros:</strong> {log.erros.length}
          </div>
        </div>
      </div>
    );
  };

  const renderErros = () => {
    if (!log || log.erros.length === 0) return null;

    return (
      <div style={{ marginTop: 16 }}>
        <h4 style={{ color: "#ef4444", marginBottom: 8 }}>Erros encontrados:</h4>
        <div
          style={{
            background: "#1f1f1f",
            border: "1px solid #ef4444",
            borderRadius: 8,
            padding: 12,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {log.erros.map((erro, index) => (
            <div
              key={index}
              style={{
                padding: "8px 0",
                borderBottom: index < log.erros.length - 1 ? "1px solid #333" : "none",
              }}
            >
              <div style={{ color: "#ef4444", fontWeight: "bold", marginBottom: 4 }}>
                Linha {erro.linha}: {erro.motivo}
              </div>
              <div style={{ color: "#9ca3af", fontSize: "0.9em", fontFamily: "monospace" }}>
                {erro.dados}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLog = () => {
    if (isPending) {
      return <div style={{ color: "#c7d2fe" }}>Processando arquivo...</div>;
    }

    if (error) {
      return (
        <div style={{ color: "#ef4444", padding: 12 }}>
          <strong>Erro:</strong> {error}
        </div>
      );
    }

    if (!log) {
      return <div style={{ color: "#c7d2fe" }}>Aguardando upload...</div>;
    }

    return (
      <>
        {renderResumo()}
        {renderErros()}
        {log.erros.length === 0 && (
          <div style={{ color: "#10b981", padding: 12 }}>
            ✓ Importação concluída com sucesso! Todos os registros foram inseridos.
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <h2>Importar CSV</h2>
      <div className="section">
        <form
          onSubmit={handleUpload}
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <input type="file" name="file" accept=".csv" disabled={isPending} />
          <button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: 16 }}>Relatório</h3>
      <div className="section">
        <pre
          style={{
            background: "#0b0c0e",
            color: "#c7d2fe",
            padding: 12,
            margin: 0,
            borderRadius: 10,
          }}
        >
          {renderLog()}
        </pre>
      </div>
    </div>
  );
}