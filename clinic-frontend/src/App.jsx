
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:2028/clinic";

const emptyForm = {
  name: "",
  addreess: "",
  phone: "",
  emergencyService: false,
};

export default function App() {
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // API request helper
  async function api(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || `HTTP error: ${response.status}`);
    }

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // READ: Display all clinics
  async function loadClinics() {
    setError("");

    try {
      const data = await api("/displayall");
      setClinics(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load clinics: " + err.message);
    }
  }

  useEffect(() => {
    loadClinics();
  }, []);

  // Handle form input
  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Reset form
  function resetForm() {
    setForm({ ...emptyForm });
    setEditId(null);
  }

  // CREATE and UPDATE
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      name: form.name.trim(),
      addreess: form.addreess.trim(),
      phone: form.phone.trim(),
      emergencyService: form.emergencyService,
    };

    try {
      if (editId !== null) {
        // UPDATE
        await api(`/update/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setMessage("Clinic updated successfully!");
      } else {
        // CREATE
        await api("/add", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setMessage("Clinic added successfully!");
      }

      resetForm();
      await loadClinics();
    } catch (err) {
      setError("Operation failed: " + err.message);
    }
  }

  // Click Update button: load clinic into form
  function handleEdit(clinic) {
    setEditId(clinic.id);

    setForm({
      name: clinic.name || "",
      addreess: clinic.addreess || "",
      phone: clinic.phone || "",
      emergencyService: Boolean(clinic.emergencyService),
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this clinic?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await api(`/delete/${id}`, {
        method: "DELETE",
      });

      if (editId === id) {
        resetForm();
      }

      setMessage("Clinic deleted successfully!");
      await loadClinics();
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  }

  // SEARCH by ID
  async function handleSearch(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!searchId || Number(searchId) <= 0) {
      setError("Please enter a valid clinic ID.");
      return;
    }

    try {
      const clinic = await api(`/displaybyid/${searchId}`);
      setClinics([clinic]);
      setMessage("Clinic found successfully!");
    } catch (err) {
      setError("Search failed: " + err.message);
    }
  }

  const emergencyCount = clinics.filter(
    (clinic) => clinic.emergencyService
  ).length;

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Clinic Management System</h1>
          <p>Manage clinic details and emergency services</p>
        </div>

        <button className="secondary" onClick={loadClinics}>
          Refresh
        </button>
      </header>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="stats">
        <div className="stat-card">
          <p>Total Clinics</p>
          <h2>{clinics.length}</h2>
        </div>

        <div className="stat-card">
          <p>Emergency Services</p>
          <h2>{emergencyCount}</h2>
        </div>

        <div className="stat-card">
          <p>Without Emergency Service</p>
          <h2>{clinics.length - emergencyCount}</h2>
        </div>
      </div>

      {/* ADD / UPDATE FORM */}
      <section className="card" id="clinic-form">
        <h2>{editId !== null ? "Update Clinic" : "Add Clinic"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Clinic Name</label>
          <input
            name="name"
            placeholder="Enter clinic name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <input
            name="addreess"
            placeholder="Enter address"
            value={form.addreess}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="emergencyService"
              checked={form.emergencyService}
              onChange={handleChange}
            />
            Emergency Service Available
          </label>

          <div className="buttons">
            <button type="submit">
              {editId !== null ? "Update Clinic" : "Add Clinic"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SEARCH */}
      <section className="card">
        <h2>Search Clinic</h2>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="number"
            min="1"
            placeholder="Enter clinic ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />

          <button type="submit">Search by ID</button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSearchId("");
              loadClinics();
            }}
          >
            Show All
          </button>
        </form>
      </section>

      {/* DISPLAY ALL + UPDATE + DELETE */}
      <section className="card">
        <h2>All Clinics</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Emergency</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {clinics.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    No clinic records found.
                  </td>
                </tr>
              ) : (
                clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td>{clinic.id}</td>
                    <td>{clinic.name}</td>
                    <td>{clinic.addreess}</td>
                    <td>{clinic.phone}</td>
                    <td>
                      <span
                        className={
                          clinic.emergencyService
                            ? "badge yes"
                            : "badge no"
                        }
                      >
                        {clinic.emergencyService ? "Available" : "No"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="edit"
                          onClick={() => handleEdit(clinic)}
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleDelete(clinic.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
