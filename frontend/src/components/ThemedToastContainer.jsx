import { ToastContainer } from "react-toastify";
import { useTheme } from "../context/useTheme.jsx";

const ThemedToastContainer = () => {
  const { resolvedTheme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
};

export default ThemedToastContainer;
