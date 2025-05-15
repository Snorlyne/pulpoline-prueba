import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import type { IWeather } from "../interfaces/weather.interface";

export default function Home() {
  const [data, setData] = useState<IWeather>();
  return (
    <div className="flex flex-col justify-center gap-4 mx-auto p-4 max-w-4xl h-full">
      <SearchBar onSearch={(data) => setData(data)} />
      <Table data={data} />
    </div>
  );
}
