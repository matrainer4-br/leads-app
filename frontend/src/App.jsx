import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: ""
  });

  const fetchLeads = async () => {
    const res = await fetch(`${API}/leads`);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({ nome: "", email: "", telefone: "" });
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Cadastro de Leads</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Nome" value={form.nome}
            onChange={(e) => setForm({...form, nome: e.target.value})}
            className="w-full p-2 border rounded" />

          <input placeholder="Email" value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full p-2 border rounded" />

          <input placeholder="Telefone" value={form.telefone}
            onChange={(e) => setForm({...form, telefone: e.target.value})}
            className="w-full p-2 border rounded" />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Salvar
          </button>
        </form>

        <div className="mt-6">
          {leads.map((lead) => (
            <div key={lead.id} className="p-3 border rounded mb-2">
              <p><b>{lead.nome}</b></p>
              <p>{lead.email}</p>
              <p>{lead.telefone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}