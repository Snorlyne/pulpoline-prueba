import type { IWeather } from "../interfaces/weather.interface";
import BaseModal from "./BaseModal";

interface ModalDetailsProps {
  data: IWeather | undefined;
  open: boolean;
  onClose: () => void;
}

export default function ModalDetails({ data, open, onClose }: ModalDetailsProps) {
  if (!data) return null;

  const { location, current } = data;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      containerClassName="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl mx-1"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-2xl">
            Weather in {location.name}, {location.region}, {location.country}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Local time: {location.localtime}
          </p>
        </div>
        <button onClick={onClose} className="flex items-start focus:outline-none h-full cursor-pointer">
          <svg
            className="w-[24px] h-[24px] text-gray-500 dark:text-white"
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
        </button>
      </div>

      <div className="flex md:flex-row flex-col gap-6">
        {/* Left Column */}
        <div className="flex flex-1 items-center gap-4">
          <img src={`https:${current.condition.icon}`} alt={current.condition.text} />
          <div>
            <p className="font-bold text-4xl">
              {current.temp_c}°C / {current.temp_f}°F
            </p>
            <p className="text-gray-600 dark:text-gray-300">{current.condition.text}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Feels like {current.feelslike_c}°C / {current.feelslike_f}°F
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 gap-4 grid grid-cols-2 text-gray-700 dark:text-gray-300 text-sm">
          <div>
            <span className="font-semibold">Wind:</span> {current.wind_kph} kph (
            {current.wind_mph} mph), {current.wind_dir}
          </div>
          <div>
            <span className="font-semibold">Humidity:</span> {current.humidity}%
          </div>
          <div>
            <span className="font-semibold">Cloud cover:</span> {current.cloud}%
          </div>
          <div>
            <span className="font-semibold">Pressure:</span> {current.pressure_mb} mb /{" "}
            {current.pressure_in} in
          </div>
          <div>
            <span className="font-semibold">Visibility:</span> {current.vis_km} km /{" "}
            {current.vis_miles} miles
          </div>
          <div>
            <span className="font-semibold">UV Index:</span> {current.uv}
          </div>
          <div>
            <span className="font-semibold">Precipitation:</span> {current.precip_mm} mm /{" "}
            {current.precip_in} in
          </div>
          <div>
            <span className="font-semibold">Gust:</span> {current.gust_kph} kph /{" "}
            {current.gust_mph} mph
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
