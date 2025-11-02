// Controller - Maneja la lógica entre el modelo y la vista
import CovidModel, { Country } from '../models/CovidModel';

class CovidController {
  // Cargar lista de países
  async loadCountries(): Promise<Country[]> {
    try {
      const countries = await CovidModel.getAllCountries();
      return countries;
    } catch (error) {
      console.error('Error in loadCountries controller:', error);
      throw new Error('No se pudieron cargar los países');
    }
  }

  // Cargar datos de un país específico
  async loadCountryDetails(countryName: string): Promise<Country> {
    try {
      const countryData = await CovidModel.getCountryData(countryName);
      return countryData;
    } catch (error) {
      console.error('Error in loadCountryDetails controller:', error);
      throw new Error('No se pudieron cargar los detalles del país');
    }
  }

  // Cargar datos históricos para la gráfica
  async loadHistoricalData(countryName: string, days: number = 30) {
    try {
      const historicalData = await CovidModel.getHistoricalData(countryName, days);
      const chartData = CovidModel.transformHistoricalDataForChart(historicalData);
      return chartData;
    } catch (error) {
      console.error('Error in loadHistoricalData controller:', error);
      throw new Error('No se pudieron cargar los datos históricos');
    }
  }

  // Formatear números grandes con comas
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export default new CovidController();
