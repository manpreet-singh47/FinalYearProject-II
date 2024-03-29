import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Login, Main } from "./containers";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./context/actions/userActions";
import { motion } from "framer-motion";
import { fadeinout } from "./animations";
import { validateUserJwtToken } from "./api";
import { Alert, MainLoader } from "./components";

const App = () => {
  const firebaseAuth = getAuth(app);
  const [isLoading, setisLoading] = useState(false);
  const alert = useSelector((state) => state.alert);

  const dispatch = useDispatch();

  useEffect(() => {
    setisLoading(true);
    firebaseAuth.onAuthStateChanged((cred) => {
      if (cred) {
        cred.getIdToken().then((token) => {
          validateUserJwtToken(token).then((data) => {
            dispatch(setUserDetails(data));
          });
        });
      }

      setInterval(() => {
        setisLoading(false);
      }, 3000);
    });
  }, []);
  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      {isLoading && (
        <motion.div
          {...fadeinout}
          className="fixed z-50 inset-0 bg-cardOverlay backdrop-blur-md flex items-center justify-center w-full"
        >
          <MainLoader />
        </motion.div>
      )}
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {alert?.type && <Alert type={alert?.type} message={alert?.message} />}
    </div>
  );
};

export default App;
