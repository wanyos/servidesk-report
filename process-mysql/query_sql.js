import { pool } from "./mysql.js";

const getIncResolutor = `SELECT DISTINCT
      I.id_incidencia AS Num_Incidencia,
      S.name AS Estado,
      DATE_FORMAT(I.inicio,"%d/%m/%Y") AS FechaApertura,
      DATE_FORMAT(I.cierre,"%d/%m/%Y") AS FechaCierre,
      U.nombre_real AS Usuario,
      E.telefono AS Extension,
      I.Titulo AS Resumen,
      G.nombre AS Grupo,
      E.nombre_real AS Tecnico_Asignado,
      T.name AS Descripcion_Tipo,
      DATE_FORMAT(I.actualizacion,"%d/%m/%Y") AS "Ultima_actuacion",
      R.data AS Localizacion
FROM tincident_field_data R
LEFT JOIN tincidencia I ON R.id_incident_field IN (98,103,109,114) AND (R.id_incident = I.id_incidencia)
LEFT JOIN tincident_status S ON I.estado = S.id
LEFT JOIN tusuario U ON I.id_creator = U.id_usuario
LEFT JOIN tusuario E ON I.id_usuario = E.id_usuario
LEFT JOIN tgrupo G ON I.id_grupo = G.id_grupo
LEFT JOIN tincident_type T ON I.id_incident_type = T.id
WHERE (I.inicio >= '2024-01-01 00:00:00') AND (I.inicio <'2025-12-31 23:59:59')
ORDER BY I.id_incidencia;`


const decodeHtmlEntities = (str) => {
  if (!str) return str;
  return str.replace(/&#x20;/g, ' ')
            .replace(/&iacute;/g, 'í')
            .replace(/&eacute;/g, 'é')
            .replace(/&oacute;/g, 'ó')
            .replace(/&aacute;/g, 'á')
            .replace(/&uacute;/g, 'ú')
            .replace(/&ntilde;/g, 'ñ')
            .replace(/&uuml;/g, 'ü')
            .replace(/&#40;/g, '(')
            .replace(/&#41;/g, ')')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&apos;/g, "'");
};


export const getAll = async () => {
  try {
    const [rows] = await pool.query(getIncResolutor)

    return rows.map(row => {
      row.Usuario = decodeHtmlEntities(row.Usuario);
      row.Resumen = decodeHtmlEntities(row.Resumen);
      row.Grupo = decodeHtmlEntities(row.Grupo);
      row.Tecnico_Asignado = decodeHtmlEntities(row.Tecnico_Asignado);
      row.Descripcion_Tipo = decodeHtmlEntities(row.Descripcion_Tipo);
      row.Localizacion = decodeHtmlEntities(row.Localizacion);
      return row;
    });

  } catch (err) {
    console.log(err)
  }
}
