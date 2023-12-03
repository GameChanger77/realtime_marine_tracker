import React, { useRef, useEffect } from 'react';
import "./Tracker.css"
function DrawGauge({ value, endValue, limitValue }) {
  const canvasRef = useRef(null);
  console.log(value);
  const startValue = value;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext('2d');
      const width = 300;
      const height = 300;
      const cx = width / 2;
      const cy = height / 2;
      const innerRadius = 100;
      const outerRadius = 130;
      const startAngle = 0;
      const lineWidth = 2;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      for (let value = 0; value <= endValue; value += endValue / 40) {
        const scaledValue = scaleIntoRange(0, endValue, 0, 270, value);
        const degrees = scaledValue + startAngle;

        if (value % (endValue / 4) === 0) {
          radiantLine(cx, cy, innerRadius-5, outerRadius, degrees, lineWidth, "black");
          radiantLine(cx, cy, innerRadius-5, outerRadius+5, ((limitValue / endValue) * 270), 4, "red");
          renderText(ctx, cx, cy, outerRadius + 10, degrees, value.toString(), "black");
        } else {
          const shorterLine = (outerRadius - innerRadius) / 2;
          radiantLine(cx, cy, innerRadius, outerRadius - shorterLine, degrees, lineWidth, "gray");
        }
      }
      centerText(ctx, cx, cy, startValue.toFixed(0), "black");

      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius, startAngle * Math.PI / 180, (270 * (value / endValue)) * Math.PI / 180, false);

      if (value > limitValue) {
        ctx.strokeStyle = "red";
      } else if (value + endValue / 10 > limitValue) {
        ctx.strokeStyle = "orange";
      } else {
        ctx.strokeStyle = "green";
      }
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, startAngle * Math.PI / 180, 1.5 * Math.PI, false);
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius-5, startAngle * Math.PI / 180, 1.5 * Math.PI, false);
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }, [value, endValue, limitValue]);

  function radiantLine(centerX, centerY, innerRadius, outerRadius, degrees, lineWidth, color) {
    const radians = degrees * Math.PI / 180;
    const innerX = centerX + innerRadius * Math.cos(radians);
    const innerY = centerY + innerRadius * Math.sin(radians);
    const outerX = centerX + outerRadius * Math.cos(radians);
    const outerY = centerY + outerRadius * Math.sin(radians);

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(outerX, outerY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function renderText(ctx, centerX, centerY, radius, degrees, text, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = "14px Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const radians = degrees * Math.PI / 180;
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);

    ctx.translate(x, y);
    ctx.rotate(radians + Math.PI / 2);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function centerText(ctx, centerX, centerY, text, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.translate(centerX, centerY);
    ctx.rotate(-135 / 180 * Math.PI);
    ctx.fillText(startValue, 0, 0);
    ctx.restore();
  }

  function scaleIntoRange(minActual, maxActual, minRange, maxRange, value) {
    const scaled = (maxRange - minRange) * (value - minActual) / (maxActual - minActual) + minRange;
    return scaled;
  }

  return (
  <div class = "outer-container">
    <canvas ref={canvasRef} width={300} height={300} class = "dial-container"/>
</div>
)
}

export default DrawGauge;
