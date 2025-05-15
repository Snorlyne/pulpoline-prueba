import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import type { IWeather } from "../interfaces/weather.interface";

export default function Home() {
  const [data, setData] = useState<IWeather[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  return (
    <div className="flex flex-col justify-center gap-4 mx-auto p-4 max-w-4xl h-full">
      <SearchBar
        onSearch={(data) => setData(data)}
        onFavorites={(favorites) => setFavorites(favorites)}
      />
      <Table data={data} favoritesData={favorites} />
    </div>
  );
}
