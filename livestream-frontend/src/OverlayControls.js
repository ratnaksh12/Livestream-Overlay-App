import React from "react";

function OverlayControls() {
  return (
    <div className="overlay-controls">
      <h2>Overlay Customization</h2>
      <form className="overlay-form">
        <label>
          Add logo:
          <input type="file" accept="image/*" />
        </label>
        <label>
          Overlay text:
          <input type="text" placeholder="Your message" />
        </label>
        <label>
          Position:
          <select>
            <option>Top-Left</option>
            <option>Top-Right</option>
            <option>Bottom-Left</option>
            <option>Bottom-Right</option>
          </select>
        </label>
        <button className="save-btn" type="button">Save Overlay</button>
      </form>
    </div>
  );
}

export default OverlayControls;
