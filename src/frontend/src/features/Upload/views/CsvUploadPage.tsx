import { useEffect, useState } from "react";
import { useUploadSendData } from "../hooks/useUploadSendData";

type UploadLog = unknown;

export default function CsvUploadPage() {
  const [log, setLog] = useState<UploadLog>(null);
  const { upload, data } = useUploadSendData();

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    upload(fd);
  };

    useEffect(() => {
    if (data) {
      setLog(data);
    }
  }, [data]);

  const renderLog = () => {
    if (log) {
      return JSON.stringify(log, null, 2);
    }
    return "Aguardando upload...";
  };

  return (
    <div>
      <h2>Importar CSV</h2>
      <div className="section">
        <form
          onSubmit={handleUpload}
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <input type="file" name="file" accept=".csv" />
          <button type="submit">Enviar</button>
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
        <p className="note">
          Tarefa: melhorar o relatório de erros (linhas e motivos mais claros;
          opcional transação por lote).
        </p>
      </div>
    </div>
  );
}
