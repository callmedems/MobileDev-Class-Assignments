export interface EquationResult {
  message: string;
  x1: string | null;
  x2: string | null;
}

export const solveQuadraticEquation = (numA: number, numB: number, numC: number): EquationResult => {
  if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
    return { message: 'Introduce los valores para los coeficientes.', x1: null, x2: null };
  }

  if (numA === 0) { // inmediatamente descarta si a es 0, pq es invalido
    return { message: 'No es una ecuación de segundo grado.', x1: null, x2: null };
  }

  const discriminant = numB * numB - 4 * numA * numC; // b^2 - 4ac, calcula el discriminante

  if (discriminant > 0) {
    const x1 = (-numB + Math.sqrt(discriminant)) / (2 * numA);
    const x2 = (-numB - Math.sqrt(discriminant)) / (2 * numA);
    return {
      message: '', // cuando son dos raíces reales y distintas
      x1: `Raíz 1 = ${x1.toFixed(4)}`,
      x2: `Raíz 2 = ${x2.toFixed(4)}`,
    };
  } else if (discriminant === 0) {
    const x1 = -numB / (2 * numA);
    return { message: '', x1: `Raíz = ${x1.toFixed(4)}`, x2: null }; // cuando hay una sola raíz
  } else {
    const realPart = -numB / (2 * numA);
    const imaginaryPart = Math.sqrt(-discriminant) / (2 * numA);
    return {
      message: '', // este es para las raíces con parte real e imaginaria
      x1: `Raíz 1 = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`,
      x2: `Raíz 2 = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`,
    };
  }
};
