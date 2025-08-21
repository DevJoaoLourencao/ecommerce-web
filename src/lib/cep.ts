export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export async function fetchCepData(cep: string): Promise<CepData | null> {
  try {
    // Remove any non-numeric characters
    const cleanCep = cep.replace(/\D/g, "");

    // Validate CEP format (8 digits)
    if (cleanCep.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Check if CEP was found
    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching CEP data:", error);
    return null;
  }
}
