import { useEffect } from "react";
import { useState } from "react";

export function useFetch(url, options = {}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    //     fetch(
    //       url,
    //       {
    //         //   ...options,
    //         //   headers: {
    //         //     Accept: "application/json; charset=UTF-8",
    //         "Access-Control-Allow-Origin": "*",
    //         mode: "no-cors",
    //         //     "Sec-Fetch-Mode": "cors",
    //         //     "Sec-Fetch-Site": "cross-site",
    //         //     ...options.headers,
    //       }
    //       // }
    //     )
    //       .then((r) => r.json())
    //       .then((data) => setData(data))
    //       .catch((e) => {
    //         setErrors(e);
    //       })
    //       .finally(() => {
    //         setLoading(false);
    //       });
    if (url == null){
        return
    }
    fetch(url, {
    //   "Access-Control-Allow-Origin": "*",
    //   "mode": "no-cors",
    //   "Content-Type": "application/json"
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // ou l'origine spécifique de votre serveur React
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json))
    //   .catch((e) => setErrors(e))
    //   .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return {
    loading,
    data,
    errors,
  };
}
