/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Pre-selected image URLs (replace with your Cloudinary URLs)
const preSelectedImages = [
  'https://res.cloudinary.com/dfuaxbx5u/image/upload/v1743283163/w4fxd8ugeurghyyupgaj.jpg',
];

// Event-specific default messages
const defaultMessages = {
  EID: 'Wishing you a joyous Eid Mubarak!',
  PUJA: 'Happy Puja! May blessings shower upon you!',
};

// Font options with weights (unchanged from your latest version)
const fontOptions = [
  { name: 'Roboto', weight: ['100', '300', '400', '500', '700', '900'] },
  { name: 'Dancing Script', weight: ['400', '500', '600', '700'] },
  { name: 'Lobster', weight: ['400'] },
  { name: 'Pacifico', weight: ['400'] },
  { name: 'Great Vibes', weight: ['400'] },
  { name: 'Montserrat', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Playfair Display', weight: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Satisfy', weight: ['400'] },
  { name: 'Amatic SC', weight: ['400', '700'] },
  { name: 'Caveat', weight: ['400', '500', '600', '700'] },
  { name: 'Cinzel', weight: ['400', '700', '900'] },
  { name: 'Lora', weight: ['400', '500', '600', '700'] },
  { name: 'Oswald', weight: ['200', '300', '400', '500', '600', '700'] },
  { name: 'Parisienne', weight: ['400'] },
  { name: 'Raleway', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Sacramento', weight: ['400'] },
];

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [event, setEvent] = useState<'EID' | 'PUJA' | ''>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');

  const [messageFontSize, setMessageFontSize] = useState<number>(30);
  const [nameFontSize, setNameFontSize] = useState<number>(25);
  const [designationFontSize, setDesignationFontSize] = useState<number>(20);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [messageX, setMessageX] = useState<number>(200);
  const [messageY, setMessageY] = useState<number>(400);
  // New states for name and designation positions
  const [nameX, setNameX] = useState<number>(250);
  const [nameY, setNameY] = useState<number>(450);
  const [designationX, setDesignationX] = useState<number>(250);
  const [designationY, setDesignationY] = useState<number>(480);
  const [fontFamily, setFontFamily] = useState<string>('Roboto');
  const [fontWeight, setFontWeight] = useState<string>('400');

  const [canvasWidth, setCanvasWidth] = useState<number>(500);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openUploadWidget = () => {
    (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'dfuaxbx5u',
        uploadPreset: 'greeting_card_upload',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setImageUrl(result.info.secure_url);
        }
      }
    ).open();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: false });
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const message = customMessage || (event ? defaultMessages[event] : '');

      if (message) {
        ctx.font = `${fontWeight} ${messageFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(message, messageX, messageY);
      }

      if (name) {
        ctx.font = `${fontWeight} ${nameFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.fillText(`- ${name}`, nameX, nameY); // Use nameX, nameY
      }

      if (designation) {
        ctx.font = `${fontWeight} ${designationFontSize}px "${fontFamily}"`;
        ctx.fillStyle = textColor;
        ctx.fillText(designation, designationX, designationY); // Use designationX, designationY
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
    nameX, // Add new dependencies
    nameY,
    designationX,
    designationY,
    fontFamily,
    fontWeight,
    canvasWidth,
    canvasHeight,
  ]);

  const generateCard = () => {
    if (!imageUrl) {
      alert('Please select or upload an image!');
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `${event || 'greeting'}-card.png`;
      link.click();
    }
  };

  return (
    <div className="app-container">
      <div className="result-column">
        <h1>Create a Greeting Card</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="canvas-preview"
        />
      </div>
      <div className="customization-column">
        <div className="section">
          <h3>Image</h3>
          <div className="image-options">
            {preSelectedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Option ${index + 1}`}
                className={imageUrl === url ? 'selected' : ''}
                onClick={() => setImageUrl(url)}
              />
            ))}
          </div>
          <button onClick={openUploadWidget}>Upload Image</button>
        </div>

        <div className="section">
          <h3>Event</h3>
          <select value={event} onChange={(e) => setEvent(e.target.value as 'EID' | 'PUJA' | '')}>
            <option value="">Select Event</option>
            <option value="EID">EID</option>
            <option value="PUJA">PUJA</option>
          </select>
        </div>

        <div className="section">
          <h3>Text</h3>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={event ? defaultMessages[event] : 'Enter custom message'}
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

        <div className="section">
          <h3>Text Styling</h3>
          <label>Message Font Size:</label>
          <input
            type="number"
            value={messageFontSize}
            onChange={(e) => setMessageFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Name Font Size:</label>
          <input
            type="number"
            value={nameFontSize}
            onChange={(e) => setNameFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Designation Font Size:</label>
          <input
            type="number"
            value={designationFontSize}
            onChange={(e) => setDesignationFontSize(Number(e.target.value))}
            min="10"
            max="100"
          />
          <label>Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
          <label>Message X Position:</label>
          <input
            type="number"
            value={messageX}
            onChange={(e) => setMessageX(Number(e.target.value))}
            min="0"
            max={canvasWidth}
          />
          <label>Message Y Position:</label>
          <input
            type="number"
            value={messageY}
            onChange={(e) => setMessageY(Number(e.target.value))}
            min="0"
            max={canvasHeight}
          />
          {/* New inputs for name position */}
          <label>Name X Position:</label>
          <input
            type="number"
            value={nameX}
            onChange={(e) => setNameX(Number(e.target.value))}
            min="0"
            max={canvasWidth}
          />
          <label>Name Y Position:</label>
          <input
            type="number"
            value={nameY}
            onChange={(e) => setNameY(Number(e.target.value))}
            min="0"
            max={canvasHeight}
          />
          {/* New inputs for designation position */}
          <label>Designation X Position:</label>
          <input
            type="number"
            value={designationX}
            onChange={(e) => setDesignationX(Number(e.target.value))}
            min="0"
            max={canvasWidth}
          />
          <label>Designation Y Position:</label>
          <input
            type="number"
            value={designationY}
            onChange={(e) => setDesignationY(Number(e.target.value))}
            min="0"
            max={canvasHeight}
          />
          <label>Font Family:</label>
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              const selectedFont = fontOptions.find((f) => f.name === e.target.value);
              setFontWeight(selectedFont?.weight[0] || '400');
            }}
          >
            {fontOptions.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
          <label>Font Weight:</label>
          <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
            {fontOptions
              .find((f) => f.name === fontFamily)
              ?.weight.map((w) => (
                <option key={w} value={w}>
                  {w === '100' ? 'Thin' :
                   w === '200' ? 'Extra Light' :
                   w === '300' ? 'Light' :
                   w === '400' ? 'Normal' :
                   w === '500' ? 'Medium' :
                   w === '600' ? 'Semi-Bold' :
                   w === '700' ? 'Bold' :
                   w === '800' ? 'Extra Bold' :
                   w === '900' ? 'Black' : w}
                </option>
              ))}
          </select>
        </div>

        <div className="section">
          <h3>Canvas Size</h3>
          <label>Width:</label>
          <input
            type="number"
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(Number(e.target.value))}
            min="200"
            max="2000"
          />
          <label>Height:</label>
          <input
            type="number"
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            min="200"
            max="2000"
          />
        </div>

        <button onClick={generateCard}>Generate & Download Card</button>
      </div>
    </div>
  );
};

export default App;