import axios from "axios";
export const baseURL =
  "http://localhost:5001/foodhood-finalyear-project/us-central1/app";

export const validateUserJwtToken = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
      headers: { Authorization: "Bearer " + token },
    });

    return res.data.data;
  } catch (err) {
    return null;
  }
};
