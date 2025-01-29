import { h } from "preact";
import { useState } from "preact/hooks";
import { parseCSV } from "@/infrastructure/csvParser";
import Radar from "@/presentation/components/Radar";
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
    } catch (error) {
      setFileError("Error parsing CSV file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        class="border-2 border-dashed border-gray-400 p-6 rounded-md text-center cursor-pointer print:hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p class="text-gray-600">Drag and drop a CSV file here</p>
        {fileError && <p class="text-red-500 mt-2">{fileError}</p>}
      </div>
      {radarData.length > 0 && (
        <div class="mt-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Radar data={radarData} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default HomePage;
