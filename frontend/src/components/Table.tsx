import { useState } from "react";
import type { IWeather } from "../interfaces/weather.interface";
import { useAuth } from "../hooks/auth.hook";

import { addFavorite, removeFavorite } from "../services/favorite.service";
import ModalDetails from "./ModalDetails";
import { handleAxiosError } from "../helpers/handleAxiosError";
import { useToastAlert } from "../hooks/toastAlert.hook";

interface TableProps {
  data: IWeather[];
  favoritesData?: string[];
}
export default function Table({ data, favoritesData }: TableProps) {
  const [favorites, setFavorites] = useState<string[]>(favoritesData || []);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<IWeather>();

  const [openDetails, setOpenDetails] = useState(false);

  const { user, openAuthModal } = useAuth();
  const { showToastAlert } = useToastAlert();

  const handleFavorite = async (city: string) => {
    if (!user) {
      openAuthModal();
    } else {
      setLoading(true);
      try {
        if (favorites.includes(city)) {
          await removeFavorite(city, user);
          setFavorites((prev) => prev.filter((item) => item !== city));
          showToastAlert("City removed from favorites", "success");
        } else {
          await addFavorite(city, user);
          setFavorites((prev) => [...prev, city]);
          showToastAlert("City added to favorites", "success");
        }
      } catch (error) {
        const { message } = handleAxiosError(error);
        showToastAlert(message, "danger");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="w-full text-gray-500 dark:text-gray-400 text-sm text-left rtl:text-right">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Condition
              </th>
              <th scope="col" className="px-6 py-3">
                Climate
              </th>
              <th scope="col" className="px-6 py-3">
                City
              </th>
              <th scope="col" className="px-6 py-3">
                Temperature
              </th>
              <th scope="col" className="px-6 py-3">
                Wind
              </th>
              <th scope="col" className="px-6 py-3">
                Humidity
              </th>
              <th scope="col" className="px-6 py-3">
                Local time
              </th>
              <th scope="col" className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 dark:border-gray-700 border-b"
                >
                  <td className="px-6 py-4">
                    <img src={item.current.condition.icon} alt="weather icon" />
                  </td>
                  <td className="px-6 py-4">{item.current.condition.text}</td>
                  <td className="px-6 py-4">{item.location.name}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{item.current.temp_c} °C</p>
                    </div>
                    <div>
                      <p>{item.current.temp_f} °F</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{item.current.wind_kph} kph</p>
                    </div>
                    <div>
                      <p>{item.current.wind_mph} mph</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.current.humidity}%</td>
                  <td className="px-6 py-4">{item.location.localtime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedData(item);
                            setOpenDetails(true);
                          }}
                          className="cursor-pointer"
                        >
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            handleFavorite(item.location.name);
                          }}
                          className="cursor-pointer"
                        >
                          {loading ? (
                            <div className="border-t-4 border-blue-500 rounded-full w-4 h-4 animate-spin" />
                          ) : (
                            <svg
                              className={`w-[24px] h-[24px] ${
                                favorites.includes(item.location.name)
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-500"
                              }`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr className="bg-white dark:bg-gray-800 dark:border-gray-700 border-b">
                <td colSpan={8} className="px-6 py-4 text-center">
                  No data
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <ModalDetails
        data={selectedData}
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      />
    </>
  );
}
