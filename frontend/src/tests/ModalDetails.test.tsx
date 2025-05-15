import { render, screen } from "@testing-library/react";
import type { IWeather } from "../interfaces/weather.interface";
import ModalDetails from "../components/ModalDetails";
const mockData: IWeather = {
  location: {
    name: "Paris",
    region: "Île-de-France",
    country: "France",
    localtime: "2025-05-15 14:00",
    lat: 48.8566,
    lon: 2.3522,
    tz_id: "Europe/Paris",
    localtime_epoch: 0,
  },
  current: {
    condition: {
      text: "Sunny",
      icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
      code: 1000,
    },
    temp_c: 25,
    temp_f: 77,
    feelslike_c: 27,
    feelslike_f: 80.6,
    wind_kph: 10,
    wind_mph: 6.2,
    wind_dir: "NE",
    humidity: 40,
    cloud: 10,
    pressure_mb: 1015,
    pressure_in: 29.97,
    vis_km: 10,
    vis_miles: 6,
    uv: 5,
    precip_mm: 0,
    precip_in: 0,
    gust_kph: 15,
    gust_mph: 9.3,
    last_updated_epoch: 0,
    last_updated: "",
    is_day: 0,
    wind_degree: 0,
    windchill_c: 0,
    windchill_f: 0,
    heatindex_c: 0,
    heatindex_f: 0,
    dewpoint_c: 0,
    dewpoint_f: 0,
  },
};

describe("ModalDetails component", () => {
  it("renders correctly when data is provided", () => {
    render(<ModalDetails data={mockData} open={true} onClose={() => {}} />);

    expect(
      screen.getByText(/Weather in Paris, Île-de-France, France/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Local time: 2025-05-15 14:00/)).toBeInTheDocument();
    expect(screen.getByText(/25°C \/ 77°F/)).toBeInTheDocument();
    expect(screen.getByText(/Sunny/)).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/)).toBeInTheDocument();
    expect(screen.getByText(/UV Index:/)).toBeInTheDocument();
  });

  it("returns null when no data is provided", () => {
    const { container } = render(
      <ModalDetails data={undefined} open={true} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
