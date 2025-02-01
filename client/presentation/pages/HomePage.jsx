import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { parseCSV } from "@/infrastructure/csvParser";
import Radar from "@/presentation/components/Radar";
import ModeSwitcher from "@/presentation/components/ModeSwitcher";
import useRadarStore from "@/domain/radarStore";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
};

const HomePage = () => {
  const [fileError, setFileError] = useState(null);
  const { radarData, setRadarData } = useRadarStore();

  useEffect(() => {
    const storedData = localStorage.getItem("radarData");
    if (storedData) {
      setRadarData(JSON.parse(storedData));
    }
  }, []);

  const handleDrop = async (e) => {
    e.preventDefault();
    setFileError(null);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".csv")) {
      setFileError("Please upload a valid CSV file.");
      return;
    }

    try {
      const parsedData = await parseCSV(file);
      setRadarData(parsedData);
      localStorage.setItem("radarData", JSON.stringify(parsedData));
    } catch (error) {
      setFileError("Error parsing CSV file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearData = () => {
    localStorage.removeItem("radarData");
    setRadarData([]);
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-background dark:text-surface">
      {radarData.length === 0 ? (
        <div
          class="border-2 border-dashed border-gray-400 dark:border-secondary p-6 rounded-md text-center cursor-pointer print:hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p class="text-gray-600 dark:text-secondary">Drag and drop a CSV file here</p>
          {fileError && <p class="text-red-500 mt-2">{fileError}</p>}
        </div>
      ) : (
        <div class="relative w-full">
          <button 
            onClick={clearData}
            class="fixed top-4 right-4 text-3xl font-bold text-red-500 hover:text-red-700 print:hidden"
            title="Discard current data"
          >
            ✕
          </button>
          <div class="mt-8">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Radar data={radarData} />
            </ErrorBoundary>
          </div>
        </div>
      )}
      <ModeSwitcher />
    </div>
  );
};

export default HomePage;
