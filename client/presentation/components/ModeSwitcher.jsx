import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const ModeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleMode = () => {
    if (isDark) {
      localStorage.setItem("mode", "light");
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      localStorage.setItem("mode", "dark");
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleMode} 
      class="fixed bottom-4 left-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg print:hidden"
      title="Toggle Dark/Light Mode">
      {isDark ? "🌙" : "☀️"}
    </button>
  );
};

export default ModeSwitcher;
