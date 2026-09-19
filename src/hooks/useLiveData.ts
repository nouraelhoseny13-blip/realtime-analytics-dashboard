import {
  useEffect,
  useRef,
  useState,
} from "react";

export function useLiveData<T>(
  initialData: T,
  updateFunction: (currentData: T) => T,
  interval = 3000
) {
  const [data, setData] = useState<T>(
    initialData
  );

  const updateRef = useRef(updateFunction);

  useEffect(() => {
    updateRef.current = updateFunction;
  }, [updateFunction]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setData((currentData) =>
        updateRef.current(currentData)
      );
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [interval]);

  return data;
}