import axios from "axios";
import { useEffect, useState } from "react";

export default function useAxiosWrapper() {
  const [data, setData] = useState(null);
  useEffect(() => console.log(data), [data])
  function fetchData(endpoint, config) {
    const url = `http://${process.env.REACT_APP_BACKEND_URL}/api/v1` + endpoint;
    axios(url, { ...config, withCredentials: true })
      .then((response) => {
        setData({ ...response.data, success: true });
      })
      .catch((error) => {
        console.log(error?.response?.data.message);
        switch (error.code) {
          case "ERR_BAD_REQUEST":
            alert(error.response?.data?.message);
            break;
          default:
            alert("Something went wrong! check console.");
            console.log(error);
            break;
        }
      });
  }

  return { data, fetchData };
}
