// Model - Maneja los datos y la lógica de negocio
import axios from 'axios';

export interface Country {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
}

export interface HistoricalData {
  country: string;
  province: string[];
  timeline: {
    cases: { [key: string]: number };
    deaths: { [key: string]: number };
    recovered: { [key: string]: number };
  };
}

class CovidModel {
  private baseURL = 'https://disease.sh/v3/covid-19';

  // Obtener todos los países
  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await axios.get<Country[]>(`${this.baseURL}/countries`);
      return response.data.sort((a, b) => a.country.localeCompare(b.country));
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  // Obtener datos de un país específico
  async getCountryData(countryName: string): Promise<Country> {
    try {
      const response = await axios.get<Country>(
        `${this.baseURL}/countries/${countryName}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${countryName}:`, error);
      throw error;
    }
  }

  // Obtener datos históricos de un país
  async getHistoricalData(
    countryName: string,
    days: number = 30
  ): Promise<HistoricalData> {
    try {
      const response = await axios.get<HistoricalData>(
        `${this.baseURL}/historical/${countryName}?lastdays=${days}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${countryName}:`, error);
      throw error;
    }
  }

  // Transformar datos históricos para la gráfica
  transformHistoricalDataForChart(historicalData: HistoricalData) {
    const cases = historicalData.timeline.cases;
    const dates = Object.keys(cases);
    const values = Object.values(cases);

    // Tomar solo algunos puntos para que la gráfica sea más legible
    const step = Math.ceil(dates.length / 10);
    const labels = dates.filter((_, index) => index % step === 0).map((date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    
    const data = values.filter((_, index) => index % step === 0);

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }
}

export default new CovidModel();
