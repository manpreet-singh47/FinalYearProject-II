import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeinout } from "../animations";

const Logininput = ({
  placeholder,
  icon,
  inputState,
  inputStateFunc,
  type,
  isSignup,
}) => {
  const [isFocus, setisFocus] = useState(false);
  return (
    <motion.div
      {...fadeinout}
      className={`flex items-center justify-center gap-4 bg-cardOverlay backdrop-blur-md rounded-md w-full  px-4 py-2 ${
        isFocus ? "shadow-md shadow-red-400" : "shadow-none"
      }`}
    >
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none"
        value={inputState}
        onChange={(e) => inputStateFunc(e.target.value)}
        onFocus={() => setisFocus(true)}
        onBlur={() => setisFocus(false)}
      />
    </motion.div>
  );
};

export default Logininput;
