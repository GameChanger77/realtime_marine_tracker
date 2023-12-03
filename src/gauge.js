import React, { useRef, useEffect } from 'react';

const LinearGauge = ({ waterLevel, limitLevel }) => {
  const canvasRef = useRef(null);
    console.log("water:"+ waterLevel);
    // waterLevel = 1.1159 * (waterLevel) - 353;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gaugeWidth = 30;
    const gaugeHeight = canvas.height - 40;
    const maxWaterLevel = 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(canvas.width / 2 - gaugeWidth / 2, 20, gaugeWidth, gaugeHeight);
    const levelPercentage = waterLevel / maxWaterLevel * gaugeHeight;

    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - gaugeWidth / 2, 20 + gaugeHeight - levelPercentage, gaugeWidth, levelPercentage);

    ctx.font = '14px Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';

    for (let i = 0; i <= maxWaterLevel; i += 20) {
      const yPos = canvas.height - i / maxWaterLevel * gaugeHeight - 15;
      ctx.fillText(`${i}%`, canvas.width / 2 - gaugeWidth / 2 - 5, yPos);
    }

    ctx.fillText('Water Level', canvas.width / 2 + gaugeWidth / 2 + 5, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - gaugeWidth / 2 - 5, canvas.height - (limitLevel / maxWaterLevel * gaugeHeight + 20));
    ctx.lineTo(canvas.width / 2 + gaugeWidth / 2 + 5, canvas.height - (limitLevel / maxWaterLevel * gaugeHeight + 20));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [waterLevel, limitLevel]);

  return <canvas ref={canvasRef} width={200} height={300} />;
};

export default LinearGauge;
