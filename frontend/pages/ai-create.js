import { useState } from "react";

export default function CreateAIRole() {
  const [form, setForm] = useState({
    user_id: "demo_user",
    name: "",
    personality: "",
    catchphrase: "",
    interests: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/ai-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          interests: form.interests.split(",").map((s) => s.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) setMessage("✅ Role created successfully!");
      else setMessage("❌ Error creating role: " + data.error?.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "Arial" }}>
      <h1>Create Your AI Companion</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="personality" placeholder="Personality (e.g. calm, cheerful)" onChange={handleChange} required />
        <input name="catchphrase" placeholder="Catchphrase (optional)" onChange={handleChange} />
        <input name="interests" placeholder="Interests (comma separated)" onChange={handleChange} />
        <input name="avatar_url" placeholder="Avatar Image URL (optional)" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create AI Role"}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}