import { readExcelFile, convertJsonToExcel } from './process-excel/convert_excel.js';
import dayjs from 'dayjs';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
import isBetween from './process-excel/plugins/isBetween.js';
import isSameOnBefore from './process-excel/plugins/isSameOnBefore.js';
import { getAll } from './process-mysql/query_sql.js';

dayjs.extend(isBetween);
dayjs.extend(isSameOnBefore);

// Obtener el directorio actual del archivo
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Construir la ruta del archivo de Excel
// const excelFilePath = path.join(__dirname, 'consulta_2024-2025.xlsx');

const convertTimestampToDate = (timestamp) => {
    return dayjs.unix(timestamp).format('DD/MM/YYYY'); 
}

const data = {
    iss_fuencarral: 'NIVEL 0 IISS FUENCARRAL',
    iss_carabanchel: 'NIVEL 0 IISS CARABANCHEL',
    iss_movilidad: 'NIVEL 0 IISS Bases Y Aparcamientos',
    iss_la_elipa: 'NIVEL 0 IISS LA ELIPA',
    iss_entrevias: 'NIVEL 0 IISS ENTREVIAS',
    iss_pacifico: 'NIVEL 0 IISS',
    iss_sanchinarro: 'NIVEL 0 IISS SANCHINARRO'
}

const getServideskInc = async (excelFilePath) => {
    const res = await readExcelFile(excelFilePath)
    const groupedByGrupo = {}; 
  
    if(res.length > 0) {
        res.forEach((item) => {
            const grupo = item.Grupo;
            item.FechaApertura = item.FechaApertura ? convertTimestampToDate(item.FechaApertura) : '';
            item.FechaCierre = item.FechaCierre ? convertTimestampToDate(item.FechaCierre) : '';

             const clave = Object.keys(data).find(key => data[key] === grupo);
          
             if (clave) {
                if (!groupedByGrupo[clave]) {
                    groupedByGrupo[clave] = [];
                }
                groupedByGrupo[clave].push(item);
            }
        });
        return groupedByGrupo;
     }
    }

const getIntegriaInc = async () => {
    const inc = await getAll('tincidencia')
    const movilidad = [];
    const tecnologia = [];

    const dataIntegria = {
        apliMovilidadd: '6.02 APLIC MOVILIDAD',
        etralux: 'MOV ETRALUX',
        siepark: 'MOV SIEPARK'
    }

    inc.forEach((item) => {
        if(item.Grupo) {
            const grupoNormalizado = item.Grupo.trim().toLowerCase();
            const isMovilidad = Object.keys(dataIntegria).some(key => dataIntegria[key].trim().toLowerCase() === grupoNormalizado);
            isMovilidad ? movilidad.push(item) : tecnologia.push(item);
        }
    })

    const integriaInc = { movilidad, tecnologia }
    return integriaInc;
}


// Num_Incidencia	Estado	FechaApertura	FechaCierre	Usuario	Extension	Resumen	Grupo	Tecnico_Asignado	Tipo_Inc	Descripcion_Tipo
const orderServidesk = [
    'Num_Incidencia',
    'Estado',
    'FechaApertura',
    'FechaCierre',
    'Usuario',
    'Extension',
    'Resumen',
    'Grupo',
    'Tecnico_Asignado',
    'Descripcion_Tipo',
    'Tipo_Inc',
  ];
  
  // Num_Incidencia Estado FechaApertura FechaCierre Usuario Extension Resumen
  // Grupo Tecnico_Asignado Descripcion_Tipo Ultima_actuacion Hora_creacion Localizacion Origen
  const orderIntegria = [
      'Num_Incidencia',
      'Estado',
      'FechaApertura',
      'FechaCierre',
      'Usuario',
      'Extension',
      'Resumen',
      'Grupo',
      'Tecnico_Asignado',
      'Descripcion_Tipo',
      'Ultima_actuacion', 
      'Localizacion', 
    ];


export const createFileIss = async (excelFilePath, openDate, closeDate) => {
    const servideskInc = await getServideskInc(excelFilePath);
    const result = [];

    Object.keys(data).forEach(key => {
        const incidents = servideskInc[key];
        if (incidents) {
          
            const keyObject = {
                tratadas: [],
                cerradas: [],
                pendientes: []
            };

            incidents.forEach(incident => {
                const fechaApertura = dayjs(incident.FechaApertura, 'DD/MM/YYYY');
                const fechaCierre = dayjs(incident.FechaCierre, 'DD/MM/YYYY');

                if (fechaApertura.isBetween(openDate, closeDate, null, '[]') && (incident.Estado === 'Abierta' || incident.Estado === 'Cerrada' || incident.Estado === 'Fijada')) {
                    keyObject.tratadas.push(incident);
                }

                if (fechaCierre.isBetween(openDate, closeDate, null, '[]') && incident.Estado === 'Cerrada') {
                    keyObject.tratadas.push(incident);
                    keyObject.cerradas.push(incident);
                }

                if (fechaApertura.isSameOrBefore(openDate) && (incident.Estado === 'Abierta' || incident.Estado === 'Fijada' || incident.Estado === 'Resolutor Externo')) {
                    keyObject.pendientes.push(incident);
                }
            });

             result.push({ [key]: keyObject });
        }
    });

     const folderName = 'iss-excel'
     const startDate = closeDate.format('DD/MM/YYYY');
     const endDate =  openDate.format('DD/MM/YYYY');
     const filesIss = [];
     for (const place of result) { 
        const filePath = await convertJsonToExcel(place, orderServidesk, folderName, startDate, endDate);
        filesIss.push(filePath);
      }
    return filesIss;
}


export const createFileIntegria = async (openDate, closeDate) => {
    const integriaInc = await getIntegriaInc();
    const result = []
    Object.keys(integriaInc).forEach((item) => {
        const incidents = integriaInc[item]

        const keyObject = {
            tratadas: [],
            cerradas: [],
            pendientes: []
        };

        incidents.forEach((inc) => {
            const fechaApertura = dayjs(inc.FechaApertura, 'D/M/YYYY');
            const fechaCierre = dayjs(inc.FechaCierre, 'D/M/YYYY');

            if (fechaApertura.isBetween(openDate, closeDate, null, '[]') && (inc.Estado === 'Nuevo' || inc.Estado === 'Cerrada' || inc.Estado === 'ASignado')) {
                keyObject.tratadas.push(inc);
            }

            if (fechaCierre.isBetween(openDate, closeDate, null, '[]') && inc.Estado === 'Cerrada') {
                keyObject.tratadas.push(inc);
                keyObject.cerradas.push(inc);
            }

            if (fechaApertura.isSameOrBefore(openDate) && (inc.Estado === 'Nuevo' || inc.Estado === 'Asignado')) {
                keyObject.pendientes.push(inc);
            }
        });
        result.push({ [item]: keyObject });
       
    })
  
    const folderName = 'integria-excel'
    const startDate = closeDate.format('DD/MM/YYYY');
    const endDate =  openDate.format('DD/MM/YYYY');
    const filesIntegria = []
    for (const place of result) {
        const file = await convertJsonToExcel(place, orderIntegria, folderName, startDate, endDate);
        filesIntegria.push(file)
    }
    return filesIntegria;
}
