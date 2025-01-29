import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

const Radar = ({ data }) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]); // Store dot positions and data
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    // Draw rings and their labels
    const ringCount = 5;
    const ringNames = ["Hold", "Open", "Assess", "Decide", "Adopt"]; // From outside inward

    for (let i = 1; i <= ringCount; i++) {
      const ringRadius = (radius / ringCount) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.stroke();

      // Add ring name at the North position
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      const labelY = centerY - ringRadius + 5; // +5 for slight offset from the line
      ctx.fillText(ringNames[ringCount - i], centerX, labelY);
    }

    // Define quadrant colors and draw filled quadrants - in clockwise order starting from top-right
    const quadrantColors = {
      Save: "rgba(255, 255, 200, 0.2)", // Light yellow - top left
      Scale: "rgba(255, 200, 200, 0.2)", // Light red - top right
      Secure: "rgba(200, 255, 200, 0.2)", // Light green - bottom right
      Maintain: "rgba(200, 200, 255, 0.2)", // Light blue - bottom left
    };

    // Draw and fill quadrants with rings of different opacity
    Object.entries(quadrantColors).forEach(([quadrant, color], index) => {
      const startAngle = (index * Math.PI) / 2;
      const endAngle = ((index + 1) * Math.PI) / 2;

      // Draw each ring separately for the quadrant
      for (let ringIndex = ringCount; ringIndex >= 1; ringIndex--) {
        const ringOuterRadius = (radius / ringCount) * ringIndex;
        const ringInnerRadius = (radius / ringCount) * (ringIndex - 1);

        // Calculate opacity: innermost ring (1) is most opaque (0.4), outermost (4) is most transparent (0.1)
        const baseOpacity = 0.4 - (ringIndex - 1) * 0.1;

        // Extract RGB values from the color string
        const rgbMatch = color.match(/\d+/g);
        if (!rgbMatch) continue;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        // Draw the ring segment
        ctx.arc(centerX, centerY, ringOuterRadius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.arc(centerX, centerY, ringInnerRadius, endAngle, startAngle, true);

        // Apply the color with calculated opacity
        ctx.fillStyle = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${baseOpacity})`;
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.stroke();
      }

      // Add quadrant labels in corners
      const padding = 20; // Padding from canvas edges

      ctx.fillStyle = "black";
      ctx.font = "bold 16px sans-serif";

      let labelX, labelY;

      if (index === 0) {
        // Save (top left)
        labelX = padding;
        labelY = padding;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
      } else if (index === 1) {
        // Scale (top right)
        labelX = width - padding;
        labelY = padding;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
      } else if (index === 2) {
        // Secure (bottom right)
        labelX = width - padding;
        labelY = height - padding;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
      } else {
        // Maintain (bottom left)
        labelX = padding;
        labelY = height - padding;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
      }

      ctx.fillText(quadrant, labelX, labelY);
    });

    // Draw quadrant lines
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.stroke();

    // Group data points by quadrant and ring
    const groupedData = data.reduce((acc, item) => {
      const quadrantKey = item.Quadrant;
      const ringKey = item.Status;
      acc[quadrantKey] = acc[quadrantKey] || {};
      acc[quadrantKey][ringKey] = acc[quadrantKey][ringKey] || [];
      acc[quadrantKey][ringKey].push(item);
      return acc;
    }, {});

    // Draw data points
    // Clear previous dots
    dotsRef.current = [];

    data.forEach((item) => {
      const { Quadrant, Status } = item;

      // Calculate base angle for the quadrant - case insensitive matching
      const quadrantLower = Quadrant.toLowerCase();
      // Calculate base angle for the quadrant
      // save = top-left (π), scale = top-right (0), secure = bottom-right (π/2), maintain = bottom-left (3π/2)
      const baseAngle =
        ((quadrantLower === "save"
          ? 2
          : quadrantLower === "scale"
            ? 3
            : quadrantLower === "secure"
              ? 0
              : quadrantLower === "maintain"
                ? 1
                : 0) *
          Math.PI) /
        2;

      // Add random angle within the quadrant (±36 degrees instead of ±45)
      // This creates a 10% buffer on each side of the quadrant lines
      const randomAngleOffset = ((Math.random() - 0.5) * Math.PI * 0.8) / 2;
      const angle = baseAngle + Math.PI / 4 + randomAngleOffset;

      // Determine ring index based on status - case insensitive matching
      const statusLower = Status.toLowerCase();
      const ringIndex =
        statusLower === "hold"
          ? 1
          : statusLower === "open"
            ? 2
            : statusLower === "assess"
              ? 3
              : statusLower === "decide"
                ? 4
                : statusLower === "adopt"
                  ? 5
                  : 1; // Default to Hold if status doesn't match

      // Calculate ring boundaries with 10% buffer on each side
      const ringWidth = radius / ringCount;
      const rawInnerRadius = ringWidth * (ringIndex - 1);
      const rawOuterRadius = ringWidth * ringIndex;

      // Add 10% buffer to both inner and outer radius
      const bufferSize = ringWidth * 0.1;
      const innerRadius = rawInnerRadius + bufferSize;
      const outerRadius = rawOuterRadius - bufferSize;

      // Random radius within the adjusted ring bounds (inner 80% of the ring)
      const pointRadius =
        innerRadius + Math.random() * (outerRadius - innerRadius);

      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      // Store dot info for hover detection
      dotsRef.current.push({
        x,
        y,
        radius: 5,
        item,
      });

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.fillText(item.Name, x + 10, y + 5);
    });
  }, [data]);

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
        {hoveredItem && (
          <div
            class="absolute bg-white p-6 rounded-xl shadow-xl border border-gray-200"
            style={{
              left: mousePos.x < 400 ? "420px" : "20px",
              top: "20px",
              width: "360px",
              maxHeight: "560px",
              overflow: "auto",
            }}
          >
            <h3 class="font-bold text-xl mb-4 pb-2 border-b-2 border-gray-100">
              {hoveredItem.Name}
            </h3>

            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-[120px_1fr] gap-3 text-sm">
                <div class="text-gray-600 font-medium">Status:</div>
                <div class="font-semibold">{hoveredItem.Status}</div>
                <div class="text-gray-600 font-medium">Quadrant:</div>
                <div class="font-semibold">{hoveredItem.Quadrant}</div>
                <div class="text-gray-600 font-medium">Owner:</div>
                <div class="font-semibold">{hoveredItem.People}</div>
                <div class="text-gray-600 font-medium">Date:</div>
                <div class="font-semibold">
                  {new Date(hoveredItem.Date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div class="bg-blue-50 rounded-lg p-4">
              <div class="text-blue-800 font-medium mb-2">Description</div>
              <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {hoveredItem.Description}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid view of items by quadrant */}
      <div class="hidden print:block mt-12">
        <div class="grid grid-cols-4 gap-6 w-[800px]">
          {["Save", "Scale", "Secure", "Maintain"].map((quadrant) => (
            <div key={quadrant} class="break-inside-avoid">
              <h3 class="font-bold text-xl mb-4 pb-2 border-b-2 border-gray-200">
                {quadrant}
              </h3>
              <div class="space-y-4">
                {(itemsByQuadrant[quadrant] || []).map((item, index) => (
                  <div
                    key={index}
                    class="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="font-medium">{item.Name}</div>
                      <div class="text-sm px-2 py-1 rounded bg-gray-200 text-gray-700">
                        {item.Status}
                      </div>
                    </div>
                    <div class="text-sm text-gray-600 whitespace-pre-wrap">
                      {item.Description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radar;
