import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { autocomplete, getWeather } from "../services/weather.service";
import type { IAutocomplete, IWeather } from "../interfaces/weather.interface";
import { LOCAL_STORAGE_KEY } from "../consts/localStorage.constant";
import { useToastAlert } from "../hooks/toastAlert.hook";
import { handleAxiosError } from "../helpers/handleAxiosError";

interface SearchBarProps {
  onSearch: (query: IWeather) => void;
}
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<IAutocomplete[]>([]);
  const [error, setError] = useState("");
  const { showToastAlert } = useToastAlert();

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (val: string) => {
        if (!val) {
          setSuggestions([]);
          return;
        }
        setLoading(true);
        const res = await autocomplete(val);
        setSuggestions(res.result);
        setLoading(false);
      }, 500),
    [history]
  );

  const handleSearch = async (city: string) => {
    try {
      if (!city) {
        setError("City is required");
        return;
      }
      setQuery("");
      setSuggestions([]);
      setShowHistory(false);
      setLoading(true);
      const res = await getWeather(city);
      if (!res.result) {
        showToastAlert("City not found", "danger");
        return;
      }
      onSearch(res.result);
      updateHistory(city);
    } catch (error) {
      const { message } = handleAxiosError(error);
      showToastAlert(message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const updateHistory = (newEntry: string) => {
    const exists = history.find((h) => h === newEntry);
    if (!exists) {
      const updated = [newEntry, ...history];
      setHistory(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      setHistory(parsed);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(query);
    setError("");
  }, [query]);

  useEffect(() => {
    console.log("Historial:", history);
  }, [history]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row max-sm:flex-col gap-2 w-full">
        <div className="w-full">
          <div className="flex items-center bg-white dark:bg-gray-800 shadow-sm p-2 border border-gray-300 dark:border-gray-600 rounded w-full">
            <input
              className="bg-transparent focus:outline-none w-full"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
            />
            {loading ? (
              <div className="border-t-4 border-blue-500 rounded-full w-4 h-4 animate-spin" />
            ) : (
              <button onClick={() => handleSearch(query)}>
                <svg
                  className="w-[24px] h-[24px] text-blue-500 cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            )}
          </div>
          {error && <p className="w-full text-red-500">{error}</p>}
          {suggestions.length > 0 && (
            <div className="flex flex-col justify-center items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
              <div className="w-full max-h-[10vh] overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 px-4 w-full text-left cursor-pointer"
                    onClick={() => handleSearch(item.name)}
                  >
                    {item.name}, {item.region}, {item.country}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="flex justify-center bg-blue-500 dark:bg-blue-700 shadow-sm p-2 rounded max-sm:w-full h-fit text-white cursor-pointer"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? (
            <svg
              className="w-[24px] h-[24px] text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          ) : (
            <svg
              className="w-[24px] h-[24px] text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
                clipRule="evenodd"
              />
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z" />
            </svg>
          )}
        </button>
      </div>
      {showHistory && (
        <div className="flex flex-col justify-center items-center gap-2 bg-white dark:bg-gray-800 py-2 border border-gray-300 dark:border-gray-600">
          <div className="w-full max-h-[10vh] overflow-y-auto">
            {history.length === 0 && <p className="text-center">No history</p>}
            {history.map((item) => (
              <button
                key={item}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 px-4 w-full text-left cursor-pointer"
                onClick={() => handleSearch(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
