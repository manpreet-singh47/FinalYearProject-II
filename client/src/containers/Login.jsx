import React, { useEffect, useState } from "react";
import { LoginBg } from "../assets";
import { Logininput } from "../components";
import { FaEnvelope, FaLock, FcGoogle } from "../assets/icons";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { app } from "../config/firebase.config";
import { validateUserJwtToken } from "../api";
import { setUserDetails } from "../context/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { alertInfo, alertWarning } from "../context/actions/alertActions";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [password, setpassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const LoginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJwtToken(token).then((data) => {
              dispatch(setUserDetails(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPassword = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      dispatch(alertInfo("Required Fields should not be empty"));
    } else {
      if (password === confirm_password) {
        setUserEmail("");
        setconfirm_password("");
        setpassword("");
        await createUserWithEmailAndPassword(
          firebaseAuth,
          userEmail,
          password
        ).then((userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJwtToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        });
      } else {
        dispatch(alertWarning("Password doesn't match"));
      }
    }
  };

  const signInWithEmailAndPass = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPass(firebaseAuth, userEmail, password).then(
        (userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJwtToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        }
      );
    } else {
      dispatch(alertWarning("Password doesn't match"));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      {/* //background Image */}
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute top-0 left-0 "
        alt=""
      />

      {/* content box */}

      <div className="flex flex-col items-center bg-cardOverlay w-[80%] md:w-460 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6">
        <div className="flex items-center justify-start gap-4 w-full">
          <h1 className="text-headingColor font-semibold text-4xl">FoodhooD</h1>
        </div>

        <p className="text-3xl font-semibold text-headingColor">
          Welcome to Foodhood
        </p>
        <p className="text-xl text-textColor -mt-6">
          {isSignup ? "Signup " : "Signin "}with following
        </p>

        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
          <Logininput
            placeholder={"Enter Your Email"}
            icon={<FaEnvelope className="text-xl text-textColor " />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignup={isSignup}
          />

          <Logininput
            placeholder={"Enter Your Password"}
            icon={<FaLock className="text-xl text-textColor " />}
            inputState={password}
            inputStateFunc={setpassword}
            type="password"
            isSignup={isSignup}
          />

          {isSignup && (
            <Logininput
              placeholder={"Confirm Your Password"}
              icon={<FaLock className="text-xl text-textColor " />}
              inputState={confirm_password}
              inputStateFunc={setconfirm_password}
              type="password"
              isSignup={isSignup}
            />
          )}

          {!isSignup ? (
            <p>
              Doesn't have an account? : {""}
              <motion.button
                {...buttonClick}
                className="text-red-600 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignup(true)}
              >
                Create One
              </motion.button>{" "}
            </p>
          ) : (
            <p>
              Already have an account? : {""}
              <motion.button
                {...buttonClick}
                className="text-red-600 underline cursor-pointer bg-transparent"
                onClick={() => setIsSignup(false)}
              >
                Sign in here
              </motion.button>{" "}
            </p>
          )}

          {isSignup ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-600 cursor-pointer text-white text-xl  capitalize hover:bg-red-700 transition-all duration-150 "
              onClick={signUpWithEmailPassword}
            >
              Sign Up
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              onClick={signInWithEmailAndPass}
              className="w-full px-4 py-2 rounded-md bg-red-600 cursor-pointer text-white text-xl  capitalize hover:bg-red-700 transition-all duration-150 "
            >
              Sign In
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-between gap-14">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>

          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-cardOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={LoginWithGoogle}
        >
          <FcGoogle className="text-3xl " />
          <p className="capitalize text-base text-black">Signin with Google </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
