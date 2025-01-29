import { h } from "preact";
import { useRef, useState } from "preact/hooks";
import RadarVisualization from "./RadarVisualization";
import ItemDetails from "./ItemDetails";
import PrintGrid from "./PrintGrid";

const Radar = ({ data }) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]); // Store dot positions and data
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x, y });

    // Check if mouse is over any dot
    const hoveredDot = dotsRef.current.find((dot) => {
      const dx = x - dot.x;
      const dy = y - dot.y;
      return Math.sqrt(dx * dx + dy * dy) <= dot.radius;
    });

    setHoveredItem(hoveredDot?.item || null);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Sort items by quadrant and ring priority
  const getItemPriority = (status) => {
    const priorities = {
      adopt: 1,
      decide: 2,
      assess: 3,
      open: 4,
      hold: 5,
    };
    return priorities[status.toLowerCase()] || 999;
  };

  const itemsByQuadrant = data.reduce((acc, item) => {
    const quadrant = item.Quadrant;
    if (!acc[quadrant]) acc[quadrant] = [];
    acc[quadrant].push(item);
    return acc;
  }, {});

  // Sort items within each quadrant by status priority
  Object.keys(itemsByQuadrant).forEach((quadrant) => {
    itemsByQuadrant[quadrant].sort(
      (a, b) => getItemPriority(a.Status) - getItemPriority(b.Status),
    );
  });

  return (
    <div class="flex flex-col items-center">
      <div class="relative w-[800px]">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <RadarVisualization
          canvasRef={canvasRef}
          data={data}
          dotsRef={dotsRef}
          width={800}
          height={600}
        />
        <ItemDetails item={hoveredItem} mousePos={mousePos} />
      </div>
      <PrintGrid data={data} />
    </div>
  );
};

export default Radar;
