import { CRITERIOS_RELLENO, PARAMS_RELLENO } from './datosRellenoSanitario';
import { CRITERIOS_TRANSFERENCIA, PARAMS_TRANSFERENCIA } from './datosPlantaTransferencia';
import { CRITERIOS_ORGANICOS, PARAMS_ORGANICOS } from './datosResiduosOrganicos';
import { CRITERIOS_INORGANICOS, PARAMS_INORGANICOS } from './datosResiduosInorganicos';

export const obtenerDatos = (tipoProyecto) => {
  if (tipoProyecto.includes('Relleno')) {
    return { criterios: CRITERIOS_RELLENO, params: PARAMS_RELLENO };
  } else if (tipoProyecto.includes('transferencia')) {
    return { criterios: CRITERIOS_TRANSFERENCIA, params: PARAMS_TRANSFERENCIA };
  } else if (tipoProyecto.includes('orgánico') || tipoProyecto.includes('organico')) {
    return { criterios: CRITERIOS_ORGANICOS, params: PARAMS_ORGANICOS };
  } else if (tipoProyecto.includes('inorgánico') || tipoProyecto.includes('inorganico')) {
    return { criterios: CRITERIOS_INORGANICOS, params: PARAMS_INORGANICOS };
  }
  return { criterios: CRITERIOS_RELLENO, params: PARAMS_RELLENO };
};