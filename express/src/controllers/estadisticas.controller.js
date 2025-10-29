import * as estadisticasService from "../services/estadisticas.service.js";

export const getConteosCicloActual = async (req, res) => {
  try {
    const conteos = await estadisticasService.getConteosCicloActual();
    // Solo cantidades, sin información extra
    res.json(conteos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo conteos del ciclo actual" });
  }
};

