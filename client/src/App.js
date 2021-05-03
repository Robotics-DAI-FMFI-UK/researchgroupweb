import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "./main.css";
import "./gridLayout.css";

import Navbar from "./navigation/Navbar.jsx";
import Footer from "./Footer.jsx";
import Routes from "./Routes.jsx";
import { FetchError, FetchLoading } from "./components/Fetchers";
import { ModeProvider } from "./providers/ModeProvider";
import { ToastProvider } from "./providers/ToastProvider";

const PagesContext = createContext();

function App() {
  const [pages, setPages] = useState();
  const [error, setError] = useState();
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    console.log("FETCH PAGES");
    axios
      .get("/pages")
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

  console.log(pages);

  return (
    <PagesContext.Provider value={{ pages, setPages }}>
      <ModeProvider>
        <ToastProvider>
          <Router>
            <Navbar pages={pages} />
            <div className="my-container">
              <Routes pages={pages} />
            </div>
            <Footer />
          </Router>
        </ToastProvider>
      </ModeProvider>
    </PagesContext.Provider>
  );
}

export const usePagesContext = () => useContext(PagesContext);

export default App;
