import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import useTheme from "@/hooks/useTheme";

const RadarVisualization = ({
  canvasRef,
  data,
  dotsRef,
  width = 800,
  height = 600,
}) => {
  const theme = useTheme();  // Hook call at top-level
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("print");
    const handlePrintChange = (e) => {
      setIsPrinting(e.matches);
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handlePrintChange);
    } else {
      mql.addListener(handlePrintChange);
    }
    // Set initial state
    setIsPrinting(mql.matches);
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handlePrintChange);
      } else {
        mql.removeListener(handlePrintChange);
      }
    };
  }, []);

  useEffect(() => {
    // Use a small delay to ensure DOM changes from theme toggle have been applied
    const timeout = setTimeout(() => {
      if (!data || data.length === 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const isDark = document.documentElement.classList.contains("dark");
      const isPrint = window.matchMedia('print').matches;
      const effectiveIsDark = isPrint ? false : isDark;
      const strokeColor = effectiveIsDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
      const ringLabelColor = effectiveIsDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.3)";
      
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 20;
      
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = effectiveIsDark ? "#3c2f2f" : "white";
      ctx.fillRect(0, 0, width, height);
      
      // Draw rings and their labels
      const ringCount = 5;
      const ringNames = ["Hold", "Open", "Assess", "Decide", "Adopt"];
      
      for (let i = 1; i <= ringCount; i++) {
        const ringRadius = (radius / ringCount) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      
        ctx.fillStyle = ringLabelColor;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const labelY = centerY - ringRadius + 25;
        ctx.fillText(ringNames[ringCount - i], centerX, labelY);
      }
      
      // Define quadrant colors and draw filled quadrants
      const quadrantColors = {
        Save: "rgba(255, 255, 200, 0.2)",
        Scale: "rgba(255, 200, 200, 0.2)",
        Secure: "rgba(200, 255, 200, 0.2)",
        Maintain: "rgba(200, 200, 255, 0.2)",
      };
      
      Object.entries(quadrantColors).forEach(([quadrant, color], index) => {
        const startAngle = (index * Math.PI) / 2;
        const endAngle = ((index + 1) * Math.PI) / 2;
      
        for (let ringIndex = ringCount; ringIndex >= 1; ringIndex--) {
          const ringOuterRadius = (radius / ringCount) * ringIndex;
          const ringInnerRadius = (radius / ringCount) * (ringIndex - 1);
          const baseOpacity = 0.4 - (ringIndex - 1) * 0.1;
          const rgbMatch = color.match(/\d+/g);
          if (!rgbMatch) return;
      
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, ringOuterRadius, startAngle, endAngle);
          ctx.lineTo(centerX, centerY);
          ctx.arc(centerX, centerY, ringInnerRadius, endAngle, startAngle, true);
          ctx.fillStyle = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${baseOpacity})`;
          ctx.fill();
          ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
          ctx.stroke();
        }
      
        // Add quadrant labels with updated style: twice as large, bold, 50% transparent outline, fill same as background
        const padding = 20;
        const quadrantLabelColor = effectiveIsDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
        const bgColor = effectiveIsDark ? "#3c2f2f" : "white";
        const labelPositions = [
          { x: padding, y: padding, align: "left", baseline: "top" },
          { x: width - padding, y: padding, align: "right", baseline: "top" },
          { x: width - padding, y: height - padding, align: "right", baseline: "bottom" },
          { x: padding, y: height - padding, align: "left", baseline: "bottom" },
        ];
        const pos = labelPositions[index];
        ctx.textAlign = pos.align;
        ctx.textBaseline = pos.baseline;
        ctx.font = "italic bold 40px Helvetica, sans-serif";
        ctx.fillStyle = bgColor;
        ctx.fillText(quadrant.toUpperCase(), pos.x, pos.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = quadrantLabelColor;
        ctx.strokeText(quadrant.toUpperCase(), pos.x, pos.y);
      });
      
      // Draw quadrant lines
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.stroke();
      
      // Clear previous dots
      dotsRef.current = [];
      
      // Plot data points
      data.forEach((item) => {
        const { Quadrant, Status } = item;
        const quadrantLower = Quadrant.toLowerCase();
        const quadrantAngleMapping = {
          save: 0,
          scale: 1,
          secure: 2,
          maintain: 3
        };
        const baseAngle = (quadrantAngleMapping[quadrantLower] * Math.PI) / 2;
      
        const randomAngleOffset = ((Math.random() - 0.5) * Math.PI * 0.8) / 2;
        const angle = baseAngle + Math.PI / 4 + randomAngleOffset;
      
        const statusLower = Status.toLowerCase();
        const ringIndex =
          statusLower === "adopt"
            ? 1
            : statusLower === "decide"
            ? 2
            : statusLower === "assess"
            ? 3
            : statusLower === "open"
            ? 4
            : statusLower === "hold"
            ? 5
            : 5;
      
        const ringWidth = radius / ringCount;
        const rawInnerRadius = ringWidth * (ringIndex - 1);
        const rawOuterRadius = ringWidth * ringIndex;
        const bufferSize = ringWidth * 0.1;
        const innerRadius = rawInnerRadius + bufferSize;
        const outerRadius = rawOuterRadius - bufferSize;
        const pointRadius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
        const x = centerX + pointRadius * Math.cos(angle);
        const y = centerY + pointRadius * Math.sin(angle);
      
        dotsRef.current.push({ x, y, radius: 5, item });
      
        const dotColors = {
          save: "#32CD32",
          scale: "#1E90FF",
          secure: "#FF4500",
          maintain: "#FFD700"
        };
        const dotColor = dotColors[quadrantLower] || "blue";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = dotColor;
        ctx.fill();
      
        const textColor = effectiveIsDark ? "white" : "black";
        ctx.fillStyle = textColor;
        ctx.font = "12px sans-serif";
        ctx.fillText(item.Name, x + 10, y + 5);
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [data, width, height, theme, isPrinting]);
  
  return null;
};

export default RadarVisualization;
