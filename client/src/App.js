import React, { createContext, useContext, useEffect, useState } from "react";
import BrowserRouter from "react-router-dom/BrowserRouter";
import axios from "axios";
import "./main.css";
import "./gridLayout.css";

import Navbar from "./navigation/Navbar.jsx";
import Footer from "./Footer.jsx";
import Routes from "./Routes.jsx";
import { FetchError, FetchLoading } from "./components/Fetchers";
import { ModeProvider } from "./providers/ModeProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { URL_PREFIX } from "./config";

const PagesContext = createContext();

function App() {

  const [pages, setPages] = useState();
  const [error, setError] = useState();
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    axios
      .get(`${URL_PREFIX}/pages`)
      .then((res) => {
        setLoaded(true);
        setPages(res.data);
      })
      .catch((err) => {
        setLoaded(true);
        setError(err);
      });
  }, []);

  if (error) return <FetchError e={error.message} />;
  if (!loaded || !pages) return <FetchLoading />;

  return (
    <PagesContext.Provider value={{ pages, setPages }}>
      <ModeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar pages={pages} />
            <div className="main-container">
              <Routes pages={pages} />
            </div>
            <Footer />
          </BrowserRouter>
        </ToastProvider>
      </ModeProvider>
    </PagesContext.Provider>
  );
}

export const usePagesContext = () => useContext(PagesContext);

export default App;
