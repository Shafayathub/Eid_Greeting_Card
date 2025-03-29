/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import "./App.css"; // Add styles here

// Pre-selected image URLs (replace with your Cloudinary URLs)
const preSelectedImages = [
  "https://res.cloudinary.com/dfuaxbx5u/image/upload/v1743283163/w4fxd8ugeurghyyupgaj.jpg",
];

// Event-specific default messages
const defaultMessages = {
  EID: "Wishing you a joyous Eid Mubarak!",
  PUJA: "Happy Puja! May blessings shower upon you!",
};

// Expanded Google Fonts options
const fontOptions = [
  { name: 'Roboto', weight: ['100', '300', '400', '500', '700', '900'] }, // Thin to Black
  { name: 'Dancing Script', weight: ['400', '500', '600', '700'] }, // Normal to Bold
  { name: 'Lobster', weight: ['400'] }, // Only Normal
  { name: 'Pacifico', weight: ['400'] }, // Only Normal
  { name: 'Great Vibes', weight: ['400'] }, // Only Normal
  { name: 'Montserrat', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] }, // Thin to Black
  { name: 'Playfair Display', weight: ['400', '500', '600', '700', '800', '900'] }, // Normal to Black
  { name: 'Satisfy', weight: ['400'] }, // Only Normal
  { name: 'Amatic SC', weight: ['400', '700'] }, // Normal, Bold
  { name: 'Caveat', weight: ['400', '500', '600', '700'] }, // Normal to Bold
  { name: 'Cinzel', weight: ['400', '700', '900'] }, // Normal, Bold, Black
  { name: 'Lora', weight: ['400', '500', '600', '700'] }, // Normal to Bold
  { name: 'Oswald', weight: ['200', '300', '400', '500', '600', '700'] }, // Extra Light to Bold
  { name: 'Parisienne', weight: ['400'] }, // Only Normal
  { name: 'Raleway', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] }, // Thin to Black
  { name: 'Sacramento', weight: ['400'] }, // Only Normal
];

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [event, setEvent] = useState<"EID" | "PUJA" | "">("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");

  // Text styling states
  const [messageFontSize, setMessageFontSize] = useState<number>(40);
  const [nameFontSize, setNameFontSize] = useState<number>(30);
  const [designationFontSize, setDesignationFontSize] = useState<number>(20);
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [messageX, setMessageX] = useState<number>(250);
  const [messageY, setMessageY] = useState<number>(400);
  const [fontFamily, setFontFamily] = useState<string>("Roboto");
  const [fontWeight, setFontWeight] = useState<string>("400");

  // Canvas size state
  const [canvasWidth, setCanvasWidth] = useState<number>(500);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cloudinary upload widget
  const openUploadWidget = () => {
    (window as any).cloudinary
      .createUploadWidget(
        {
          cloudName: "dfuaxbx5u", // Replace with your Cloudinary cloud name
          uploadPreset: "greeting_card_upload", // Replace with your unsigned preset
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setImageUrl(result.info.secure_url);
          }
        }
      )
      .open();
  };

  // Draw image and text on canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: false });
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const message = customMessage || (event ? defaultMessages[event] : "");
      const nameY = messageY + messageFontSize + 10;
      const designationY = nameY + nameFontSize + 10;

      if (message) {
        ctx.font = `${fontWeight} ${messageFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText(message, messageX, messageY);
      }

      if (name) {
        ctx.font = `${fontWeight} ${nameFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.fillText(`- ${name}`, messageX, nameY);
      }

      if (designation) {
        ctx.font = `${fontWeight} ${designationFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.fillText(designation, messageX, designationY);
      }
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    if (imageUrl) drawCanvas();
  }, [
    imageUrl,
    event,
    customMessage,
    name,
    designation,
    messageFontSize,
    nameFontSize,
    designationFontSize,
    textColor,
    messageX,
    messageY,
    fontFamily,
    fontWeight,
    canvasWidth,
    canvasHeight,
  ]);

  const generateCard = () => {
    if (!imageUrl) {
      alert("Please select or upload an image!");
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png", 1.0);
      link.download = `${event || "greeting"}-card.png`;
      link.click();
    }
  };

  return (
    <div className="app-container">
      <div className="result-column">
        <h1>Simple Next Level Greetings Card</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black", maxWidth: "100%" }}
        />
      </div>
      <div className="customization-column">
        {/* Image Selection */}
        <div className="section">
          <h3>Choose an Image</h3>
          <div className="image-options">
            {preSelectedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Option ${index + 1}`}
                className={imageUrl === url ? "selected" : ""}
                onClick={() => setImageUrl(url)}
              />
            ))}
          </div>
          <button onClick={openUploadWidget}>Upload Your Own Image</button>
        </div>

        {/* Event Selection */}
        <div className="section">
          <label>Event: </label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value as "EID" | "PUJA" | "")}
          >
            <option value="">Select Event</option>
            <option value="EID">EID</option>
            <option value="PUJA">PUJA</option>
          </select>
        </div>

        {/* Canvas Size Controls */}
        <div className="section">
          <h3>Canvas Size</h3>
          <label>Width: </label>
          <input
            type="number"
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(Number(e.target.value))}
            min="200"
            max="2000"
          />
          <label>Height: </label>
          <input
            type="number"
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            min="200"
            max="2000"
          />
        </div>

        {/* Text Inputs */}
        <div className="section">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={
              event ? defaultMessages[event] : "Enter custom message"
            }
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Enter designation"
          />
        </div>

        {/* Text Styling Controls */}
        <div className="section">
          <h3>Customize Text</h3>
          <label>Message Font Size: </label>
          <input
            type="number"
            value={messageFontSize}
            onChange={(e) => setMessageFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Name Font Size: </label>
          <input
            type="number"
            value={nameFontSize}
            onChange={(e) => setNameFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Designation Font Size: </label>
          <input
            type="number"
            value={designationFontSize}
            onChange={(e) => setDesignationFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Text Color: </label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
          <label>X Position: </label>
          <input
            type="number"
            value={messageX}
            onChange={(e) => setMessageX(Number(e.target.value))}
            min="0"
            max={canvasWidth}
          />
          <label>Y Position (Message): </label>
          <input
            type="number"
            value={messageY}
            onChange={(e) => setMessageY(Number(e.target.value))}
            min="0"
            max={canvasHeight}
          />
          <label>Font Family: </label>
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              const selectedFont = fontOptions.find(
                (f) => f.name === e.target.value
              );
              setFontWeight(selectedFont?.weight[0] || "400");
            }}
          >
            {fontOptions.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
          <label>Font Weight: </label>
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
          >
            {fontOptions
              .find((f) => f.name === fontFamily)
              ?.weight.map((w) => (
                <option key={w} value={w}>
                  {w === "100"
                    ? "Thin"
                    : w === "200"
                    ? "Extra Light"
                    : w === "300"
                    ? "Light"
                    : w === "400"
                    ? "Normal"
                    : w === "500"
                    ? "Medium"
                    : w === "600"
                    ? "Semi-Bold"
                    : w === "700"
                    ? "Bold"
                    : w === "800"
                    ? "Extra Bold"
                    : w === "900"
                    ? "Black"
                    : w}
                </option>
              ))}
          </select>
        </div>

        

        {/* Generate Button */}
        <button onClick={generateCard}>Generate & Download Card</button>
      </div>
    </div>
  );
};

export default App;
