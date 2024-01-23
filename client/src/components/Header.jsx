import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import { MdLogout, MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../config/firebase.config";
import { setUserNull } from "../context/actions/userActions";

const Header = () => {
  const user = useSelector((state) => state.user);

  const [ismenu, setismenu] = useState(false);
  const firebaseAuth = getAuth(app);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        dispatch(setUserNull());
        navigate("/login", { replace: true });
      })
      .catch((err) => console.log(err));
  };
  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6 bg-orange-500">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        {/* LOGO */}
        <h1 className="text-white font-semibold text-3xl">Foodhood</h1>
      </NavLink>

      <nav className="flex items-center justify-center gap-8 ">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/services"}
          >
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/aboutus"}
          >
            About Us
          </NavLink>
        </ul>

        <motion.div {...buttonClick} className="relative cursor-pointer ">
          <MdShoppingCart className="text-3xl text-white" />
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 absolute -top-4 -right-1 ">
            <p className="text-primary text-base font-semibold">2</p>
          </div>

          {user ? (
            <>
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => {
                  setismenu(true);
                }}
              >
                <div className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden bg-green-200 flex items-center justify-center">
                  <motion.img
                    className="w-full h-full object-cover"
                    src={user?.picture ? user?.picture : "Avatar"}
                    whileHover={{ scale: 1.15 }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {ismenu && (
                  <motion.div
                    {...slideTop}
                    onMouseLeave={() => {
                      setismenu(false);
                    }}
                    className="px-6 py-4 w-48 bg-cardOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
                  >
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/dashboard/home"}
                    >
                      Dashboard
                    </Link>

                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/profile"}
                    >
                      Profile
                    </Link>

                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/user-orders"}
                    >
                      Orders
                    </Link>
                    <hr />
                    <motion.div
                      {...buttonClick}
                      onClick={signOut}
                      className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                    >
                      <MdLogout className="text-2xl text-textColor group-hover:text-headingColor" />

                      <p className="text-textColor text-xl group-hover:text-headingColor">
                        Sign Out
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>
                <motion.button
                  {...buttonClick}
                  className="px-4 py-2 rounded-md shadow-md bg-cardOverlay border border-red-300 cursor-pointer"
                >
                  Login
                </motion.button>
              </NavLink>
            </>
          )}
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;
