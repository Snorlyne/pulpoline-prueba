import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import type { IWeather } from "../interfaces/weather.interface";

export default function Home() {
  const [data, setData] = useState<IWeather[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  return (
    <div className="flex flex-col justify-center gap-4 mx-auto p-4 max-w-4xl h-full">
      <h1 className="font-bold text-2xl text-center">Weather App</h1>
      <p className="text-gray-500 text-center">
        Get the latest weather updates for your city
      </p>
      <SearchBar
        onSearch={(data) => setData(data)}
        onFavorites={(favorites) => setFavorites(favorites)}
      />
      <Table data={data} favoritesData={favorites} />
    </div>
  );
}
