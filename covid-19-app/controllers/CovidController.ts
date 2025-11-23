// Controller
import CovidModel, { Country } from '../models/CovidModel';

class CovidController {
  //cargar lista de países
  async loadCountries(): Promise<Country[]> {
    try {
      const countries = await CovidModel.getAllCountries();
      return countries;
    } catch (error) {
      console.error('Error in loadCountries controller:', error);
      throw new Error('No se pudieron cargar los países');
    }
  }

  // cargar datos de un país específico
  async loadCountryDetails(countryName: string): Promise<Country> {
    try {
      const countryData = await CovidModel.getCountryData(countryName);
      return countryData;
    } catch (error) {
      console.error('Error in loadCountryDetails controller:', error);
      throw new Error('No se pudieron cargar los detalles del país');
    }
  }

  // cargar datos históricos de muertes para la gráfica
  async loadDeathsData(countryName: string) {
    try {
      // Obtener todos los datos históricos disponibles (all = desde el inicio)
      const historicalData = await CovidModel.getHistoricalData(countryName, 'all');
      const chartData = CovidModel.transformDeathsDataForChart(historicalData);
      return chartData;
    } catch (error) {
      console.log(`${countryName} no tiene datos históricos disponibles`);
      // Retornar null para mostrar el mensaje "No hay datos históricos"
      return null;
    }
  }

  // Buscar países por nombre
  async searchCountries(query: string): Promise<Country[]> {
    try {
      const allCountries = await this.loadCountries();
      if (!query || query.trim() === '') {
        return allCountries;
      }
      const lowerQuery = query.toLowerCase();
      return allCountries.filter(country => 
        country.country.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error in searchCountries controller:', error);
      throw new Error('Error al buscar países');
    }
  }

  // Formatear números grandes con comas
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export default new CovidController();
