import React, { useContext, useState, createContext } from "react";
import Toast from "react-bootstrap/Toast";

const ToastContext = createContext();

// TODO neni vidno ak som scrollnuty dole
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    status: "", // "succeeded" | "failed"
    message: "", // custom message
  });

  const setSuccessToast = (msg) => {
    setToast({ status: "succeeded", message: msg });
  };

  const setErrorToast = (msg) => {
    setToast({ status: "error", message: msg });
  };

  const MyToast = () => {
    const backgroundColor =
      toast.status === "succeeded" ? "#aeffad" : "#ffabab";

    const color = toast.status === "succeeded" ? "#29a224" : "#b12626";

    return (
      <Toast
        className="my-toast"
        onClose={() => setToast()}
        show={toast}
        delay={3000}
        autohide
        style={{ backgroundColor }}
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>
          <strong style={{ color }}>{toast.message}</strong>
        </Toast.Body>
      </Toast>
    );
  };

  return (
    <ToastContext.Provider value={{ toast, setSuccessToast, setErrorToast }}>
      {toast?.message && <MyToast />}
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
