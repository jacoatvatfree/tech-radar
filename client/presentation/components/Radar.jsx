import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const Radar = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    // Draw rings
    const ringCount = 4;
    for (let i = 1; i <= ringCount; i++) {
      const ringRadius = (radius / ringCount) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.stroke();
    }

    // Draw quadrants
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.stroke();

    // Draw data points
    data.forEach((item) => {
      const { Quadrant, Status } = item;
      const angle = (
        (Quadrant === 'Techniques' ? 0 :
          Quadrant === 'Tools' ? 1 :
            Quadrant === 'Platforms' ? 2 :
              3) *
        Math.PI / 2
      ) + Math.PI / 4;
      const ringIndex =
        Status === 'Hold' ? 1 :
          Status === 'Assess' ? 2 :
            Status === 'Trial' ? 3 :
              4;
      const pointRadius = (radius / ringCount) * ringIndex - (radius / ringCount) / 2;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.font = '12px sans-serif';
      ctx.fillText(item.Name, x + 10, y + 5);
    });
  }, [data]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Radar;
