import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rnd } from "react-rnd";
import LivestreamPlayer from "./LivestreamPlayer";
import "./App.css";

function App() {
  const [overlays, setOverlays] = useState([]);
  const [form, setForm] = useState({
    id: "",
    type: "text",
    content: "",
    imageUrl: "",
    position: { x: 200, y: 100 },
    size: { width: 150, height: 50 }
  });
  const [editingId, setEditingId] = useState(null);
  const [imageWarning, setImageWarning] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/overlays")
      .then((response) => setOverlays(response.data))
      .catch((error) => console.error(error));
  }, []);

  const validateImage = (url) => {
    if (!url) {
      setImageWarning("");
      return;
    }
    const img = new window.Image();
    img.onload = () => setImageWarning("");
    img.onerror = () => setImageWarning("Image URL is invalid or not accessible.");
    img.src = url;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.type === "logo" && imageWarning) {
      return;
    }
    if (editingId === null) {
      const newOverlay = { ...form, id: Date.now() };
      axios.post("http://127.0.0.1:5000/api/overlays", newOverlay).then(() => {
        setOverlays((prev) => [...prev, newOverlay]);
        resetForm();
      });
    } else {
      axios
        .put(`http://127.0.0.1:5000/api/overlays/${editingId}`, form)
        .then(() => {
          setOverlays((prev) =>
            prev.map((o) => (o.id === editingId ? form : o))
          );
          resetForm();
          setEditingId(null);
        });
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      type: "text",
      content: "",
      imageUrl: "",
      position: { x: 200, y: 100 },
      size: { width: 150, height: 50 }
    });
    setImageWarning("");
  };

  const handleEdit = (overlay) => {
    setForm(overlay);
    setEditingId(overlay.id);
    if (overlay.type === "logo" && overlay.imageUrl) {
      validateImage(overlay.imageUrl);
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:5000/api/overlays/${id}`).then(() => {
      setOverlays((prev) => prev.filter((o) => o.id !== id));
      if (editingId === id) {
        resetForm();
        setEditingId(null);
      }
    });
  };

  const handleUpdateOverlay = (id, newProps) => {
    const updated = { ...overlays.find((o) => o.id === id), ...newProps };
    axios.put(`http://127.0.0.1:5000/api/overlays/${id}`, updated).then(() => {
      setOverlays((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...newProps } : o))
      );
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Livestream Viewer</h1>
        <p>Watch livestream, customize overlays, enjoy the experience.</p>
      </header>
      <main>
        <div className="player-container" style={{ position: "relative", width: 640, height: 360 }}>
          <LivestreamPlayer />
          {overlays.map((overlay) => (
            <Rnd
              key={overlay.id}
              size={{ width: overlay.size.width, height: overlay.size.height }}
              position={{ x: overlay.position.x, y: overlay.position.y }}
              bounds="parent"
              onDragStop={(e, d) =>
                handleUpdateOverlay(overlay.id, { position: { x: d.x, y: d.y } })
              }
              onResizeStop={(e, direction, ref, delta, position) => {
                handleUpdateOverlay(overlay.id, {
                  size: { width: parseInt(ref.style.width), height: parseInt(ref.style.height) },
                  position,
                });
              }}
              style={{
                zIndex: 10,
                borderRadius: 6,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: overlay.type === "text" ? "rgba(0,0,0,0.5)" : "transparent",
                color: "#fff",
                pointerEvents: "auto",
              }}
            >
              {/* REMOVED IMAGE PREVIEW! */}
              {overlay.type === "logo"
                ? overlay.content
                : overlay.content}
            </Rnd>
          ))}
        </div>

        <div className="overlay-controls">
          <h2>{editingId === null ? "Add New Overlay" : "Edit Overlay"}</h2>
          <form className="overlay-form" onSubmit={handleSubmit}>
            <label>
              Type:
              <select
                value={form.type}
                onChange={e => {
                  setForm({ ...form, type: e.target.value });
                  setImageWarning("");
                }}>
                <option value="text">Text</option>
                <option value="logo">Logo/Image</option>
              </select>
            </label>
            {form.type === "text" && (
              <label>
                Overlay text:
                <input
                  type="text"
                  placeholder="Overlay Text"
                  value={form.content}
                  required
                  onChange={e => setForm({ ...form, content: e.target.value })}
                />
              </label>
            )}
            {form.type === "logo" && (
              <>
                <label>
                  Image URL:
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    required
                    onBlur={() => validateImage(form.imageUrl)}
                    onChange={e => {
                      setForm({ ...form, imageUrl: e.target.value });
                      setImageWarning("");
                    }}
                  />
                </label>
                {imageWarning && (
                  <div style={{ color: "red", marginBottom: 8 }}>{imageWarning}</div>
                )}
              </>
            )}
            <button className="save-btn" type="submit" disabled={form.type === "logo" && !!imageWarning}>
              {editingId === null ? "Add" : "Update"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                }}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="overlay-controls">
          <h2>Overlay List</h2>
          {overlays.length === 0 ? (
            <p>No overlays found.</p>
          ) : (
            <ul>
              {overlays.map((overlay) => (
                <li key={overlay.id}>
                  <strong>Type:</strong> {overlay.type} <br />
                  <strong>Content:</strong> {overlay.content} <br />
                  {overlay.type === "logo" && (
                    <>
                      <strong>Image URL: </strong>
                      <span className="overlay-url">{overlay.imageUrl}</span><br />
                    </>
                  )}
                  <strong>Position:</strong> x: {overlay.position.x}, y: {overlay.position.y} <br />
                  <strong>Size:</strong> w: {overlay.size.width}, h: {overlay.size.height} <br />
                  <button onClick={() => handleEdit(overlay)}>Edit</button>
                  <button onClick={() => handleDelete(overlay.id)} style={{ marginLeft: 10 }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer className="footer">
        <span>© 2025 Livestream App</span>
      </footer>
    </div>
  );
}

export default App;
