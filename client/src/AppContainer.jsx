import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import createAppStore from "./redux/store";
import axios from "axios";
import CommonLoading from "./components/loader/CommonLoading";
import App from "./App";
import { getTitleFromRoute } from "./utils/docTitle";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";

const ErrorComponent = ({ errorMessage }) => (
  <div className="text-red-500 font-bold text-center">{errorMessage}</div>
);

const AppContainer = () => {
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check server status
        try {
          await axios.get("/server-status");
        } catch (err) {
          setError("Server is down. Please try again later.");
          setLoading(false);
          return;
        }

        // Initialize store
        const appStore = await createAppStore();
        setStore(appStore);
      } catch (err) {
        setError(`Error initializing the app: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        {loading ? <CommonLoading /> : <ErrorComponent errorMessage={error} />}
      </div>
    );
  }

  return (
    <Provider store={store}>
      <SocketProvider>
        <Helmet>
          <title>{getTitleFromRoute(location.pathname)}</title>
        </Helmet>
        <App />
      </SocketProvider>
    </Provider>
  );
};

export default AppContainer;
