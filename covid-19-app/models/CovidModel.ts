// Model
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

  //obtener los países
  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await axios.get<Country[]>(`${this.baseURL}/countries`);
      return response.data.sort((a, b) => a.country.localeCompare(b.country));
    } catch (error) {
      console.error('Error al obtener los países:', error);
      throw error;
    }
  }

  //buscar datos de un país específico
  async getCountryData(countryName: string): Promise<Country> {
    try {
      const response = await axios.get<Country>(
        `${this.baseURL}/countries/${countryName}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al buscar datos para ${countryName}:`, error);
      throw error;
    }
  }

  //datos históricos de un país
  async getHistoricalData(
    countryName: string,
    days: number | 'all' = 30
  ): Promise<HistoricalData> {
    try {
      const response = await axios.get<HistoricalData>(
        `${this.baseURL}/historical/${countryName}?lastdays=${days}`
      );
      console.log(`Datos históricos obtenidos para ${countryName}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener datos históricos para ${countryName}:`, error);
      throw error;
    }
  }

  //datos históricos de muertes por año para la gráfica
  transformDeathsDataForChart(historicalData: HistoricalData) {
    const deaths = historicalData.timeline.deaths;
    const dates = Object.keys(deaths);
    const values = Object.values(deaths);

    if (dates.length === 0 || values.every(v => v === 0)) {
      console.log('No hay datos válidos');
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0], color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, strokeWidth: 3 }],
      };
    }

    // Agrupar por año
    const deathsByYear: { [year: string]: number } = {};
    
    dates.forEach((date, index) => {
      let year: number;
      
      // intentamos parsear la fecha en diferentes formatos
      if (date.includes('/')) {
        // Formato: "1/22/20" o "1/22/2020"
        const parts = date.split('/');
        const yearPart = parts[2];
        year = yearPart.length === 2 ? 2000 + parseInt(yearPart) : parseInt(yearPart);
      } else {
        year = new Date(date).getFullYear();
      }
      
      const yearStr = year.toString();
      
      //se guarda el valor máximo de cada año
      if (!deathsByYear[yearStr] || values[index] > deathsByYear[yearStr]) {
        deathsByYear[yearStr] = values[index];
      }
    });

    //años desde 2020 en adelante
    const years = Object.keys(deathsByYear)
      .filter(year => parseInt(year) >= 2020)
      .sort();
    
    const yearlyDeaths = years.map(year => deathsByYear[year]);

    // Verificar que tengamos datos válidos
    if (years.length === 0 || yearlyDeaths.every(d => d === 0)) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0], color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, strokeWidth: 3 }],
      };
    }

    return {
      labels: years,
      datasets: [
        {
          data: yearlyDeaths,
          color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  }
}

export default new CovidModel();
