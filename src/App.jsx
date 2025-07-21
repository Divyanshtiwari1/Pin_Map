import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";

const App = () => {
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    const storedPins = JSON.parse(localStorage.getItem("map_pins")) || [];
    setPins(storedPins);
  }, []);

  const handleAddPin = (pin) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newPin = { ...pin, id: Date.now(), timestamp };
    const updatedPins = [...pins, newPin];
    setPins(updatedPins);
    localStorage.setItem("map_pins", JSON.stringify(updatedPins));
  };

  const handleDeletePin = (id) => {
    const updatedPins = pins.filter((pin) => pin.id !== id);
    setPins(updatedPins);
    localStorage.setItem("map_pins", JSON.stringify(updatedPins));
    setSelectedPin(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold shadow">
        📍 Pin Drop Tool
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Saved Pins</h2>

          {pins.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              📭 No pins saved yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {pins.map((pin, index) => (
                <li
                  key={pin.id}
                  className="p-2 bg-white shadow rounded hover:bg-blue-100 flex justify-between items-center"
                  onClick={() => setSelectedPin(pin)}
                >
                  <span>Saved Pin {index + 1}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePin(pin.id);
                    }}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 relative bg-gray-50">
          <div className="absolute inset-0">
            <MapView
              onAddPin={handleAddPin}
              selectedPin={selectedPin}
              onClearSelectedPin={() => setSelectedPin(null)}
            />
          </div>
        </main>

        <aside className="w-64 bg-gray-50 border-l p-4">
          <h2 className="text-lg font-bold mb-2">Details</h2>
          {selectedPin ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Remark:</strong> {selectedPin.remark}
              </p>
              <p>
                <strong>Latitude:</strong> {selectedPin.lat.toFixed(5)}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedPin.lng.toFixed(5)}
              </p>
              <p>
                <strong>Time:</strong> {selectedPin.timestamp}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Click a pin to see details.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default App;
