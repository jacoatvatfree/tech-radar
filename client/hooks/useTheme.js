import { useState, useEffect } from "preact/hooks";

const getTheme = () => localStorage.getItem("mode") || "light";

const useTheme = () => {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    // Listen to custom "modeChange" events and storage changes
    const handleModeChange = () => {
      setTheme(getTheme());
    };

    const storageCallback = (e) => {
      if (e.key === "mode") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("modeChange", handleModeChange);
    window.addEventListener("storage", storageCallback);

    // Use a MutationObserver to watch for changes to the 'class' attribute on the documentElement
    const observer = new MutationObserver(() => {
      // When class changes, update theme based on whether the 'dark' class is present
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("modeChange", handleModeChange);
      window.removeEventListener("storage", storageCallback);
      observer.disconnect();
    };
  }, []);

  return theme;
};

export default useTheme;
