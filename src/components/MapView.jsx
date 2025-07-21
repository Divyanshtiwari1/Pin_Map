import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ClickableMap = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
};

const FlyToPin = ({ selectedPin }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPin) {
      map.flyTo([selectedPin.lat, selectedPin.lng], 13);
    }
  }, [selectedPin, map]);

  return null;
};

const MapView = ({ onAddPin, selectedPin, onClearSelectedPin }) => {
  const [clickedCoords, setClickedCoords] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [remark, setRemark] = useState("");
  const [pinPosition, setPinPosition] = useState(null);
  const inputRef = useRef();

  const handleMapClick = (e) => {
    if (onClearSelectedPin) {
      onClearSelectedPin();
    }

    const { lat, lng } = e.latlng;
    const { x, y } = e.containerPoint;
    setClickedCoords({ lat, lng });
    setPinPosition({ x, y });
    setShowPopup(true);
  };

  const handleSave = () => {
    if (!clickedCoords) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    onAddPin({
      lat: clickedCoords.lat,
      lng: clickedCoords.lng,
      remark,
      time,
    });

    setShowPopup(false);
    setRemark("");
    setClickedCoords(null);
    setPinPosition(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] max-h-screen">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickableMap onMapClick={handleMapClick} />
        <FlyToPin selectedPin={selectedPin} />

        {selectedPin && (
          <Marker position={[selectedPin.lat, selectedPin.lng]}>
            <div className="text-2xl absolute">📍</div>
          </Marker>
        )}
      </MapContainer>

      {showPopup && pinPosition && (
        <>
          <div
            className="absolute text-2xl z-10 pointer-events-none"
            style={{
              top: Math.max(pinPosition.y - 24, 8),
              left: Math.max(pinPosition.x - 12, 8),
            }}
          >
            📍
          </div>
          <div
            className="absolute z-20 bg-white p-3 rounded shadow-md border border-gray-300 w-[200px] max-w-[90vw]"
            style={{
              top: Math.min(pinPosition.y, window.innerHeight - 140),
              left: Math.min(pinPosition.x + 20, window.innerWidth - 220),
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter remark..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
            />
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
