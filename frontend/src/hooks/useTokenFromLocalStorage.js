import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import useLocalStorage from "./useLocalStorage";

const useTokenFromLocalStorage = (initialValue) => {
  const [value, setValue] = useLocalStorage("token", initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    checkToken();
  }, [value]);

  const checkToken = async () => {
    const { data } = await Axios.post("/check-token", { token: value });
    console.log("Check Token", data);
    setIsValid(data.isValid);
  };
  return [value, setValue, isValid];
};

export default useTokenFromLocalStorage;
