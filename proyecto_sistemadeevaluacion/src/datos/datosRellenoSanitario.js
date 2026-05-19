// MÓDULO 4: Relleno Sanitario
// Puntaje máximo total: 1000 pts

export const CRITERIOS_RELLENO = [
  { nombre: 'Ordenamiento territorial',  pct: 16, bg: '#fef9c3', border: '#fde047', text: '#854d0e', btnColor: '#ca8a04' },
  { nombre: 'Construcción y operación',  pct: 32, bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', btnColor: '#2563eb' },
  { nombre: 'Accesibilidad vial',         pct: 24, bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d', btnColor: '#db2777' },
  { nombre: 'Impacto ambiental',          pct: 16, bg: '#dcfce7', border: '#86efac', text: '#14532d', btnColor: '#16a34a' },
  { nombre: 'Viabilidad económica',       pct: 12, bg: '#ffedd5', border: '#fdba74', text: '#9a3412', btnColor: '#ea580c' },
];

// Nota: pct de cada subparámetro = (puntos / puntos_del_criterio) * 100
// Criterio 1 = 160 pts | Criterio 2 = 320 pts | Criterio 3 = 240 pts
// Criterio 4 = 160 pts | Criterio 5 = 120 pts

export const PARAMS_RELLENO = [

  // ── Criterio 1: Ordenamiento territorial (160 pts) ──────────────────
  [
    { nombre: 'Uso del suelo', subs: [
      { nombre: 'Áreas e inmuebles considerados patrimonio cultural.',           pct: 0      },
      { nombre: 'Áreas de protección para la producción',                        pct: 31.25  }, // 50/160
      { nombre: 'Otras áreas rurales',                                            pct: 62.5   }, // 100/160
      { nombre: 'Áreas del sistema de servicios públicos domiciliarios',          pct: 125    }, // 200/160
    ]},
    { nombre: 'Restricciones en la disponibilidad del área', subs: [
      { nombre: 'Existen más de dos restricciones',  pct: 0     },
      { nombre: 'Existen dos restricciones',          pct: 12.5  }, // 20/160
      { nombre: 'Existe una restricción',              pct: 18.75 }, // 30/160
      { nombre: 'No existen restricciones',            pct: 25    }, // 40/160
    ]},
  ],

  // ── Criterio 2: Construcción y operación (320 pts) ──────────────────
  [
    { nombre: 'Facilidad para el movimiento de tierras', subs: [
      { nombre: 'Imposible',   pct: 0      },
      { nombre: 'Difícil',     pct: 3.125  }, // 10/320
      { nombre: 'Regular',     pct: 6.25   }, // 20/320
      { nombre: 'Fácil',       pct: 9.375  }, // 30/320
      { nombre: 'Muy Fácil',   pct: 12.5   }, // 40/320
    ]},
    { nombre: 'Pendiente promedio del terreno', subs: [
      { nombre: 'Más del 8%',            pct: 0      },
      { nombre: 'Entre el 6,1% y el 8%', pct: 3.125  }, // 10/320
      { nombre: 'Entre el 4,1% y 6%',    pct: 6.25   }, // 20/320
      { nombre: 'Entre 2,1% y 4%',       pct: 9.375  }, // 30/320
      { nombre: 'Entre 0% y 2%',          pct: 12.5   }, // 40/320
    ]},
    { nombre: 'Capacidad', subs: [
      { nombre: 'Igual o menor a 0,5 veces la producción de residuos',                   pct: 0      },
      { nombre: 'Entre más de 0,5 veces y 1 vez la producción de residuos',              pct: 18.75  }, // 60/320
      { nombre: 'Entre más de 1 vez y 1,5 veces la producción de residuos',             pct: 25     }, // 80/320
      { nombre: 'Entre más de 1,5 veces y 2 veces la producción de residuos',           pct: 31.25  }, // 100/320
      { nombre: 'Mayor a 2 veces la producción de residuos',                             pct: 37.5   }, // 120/320
    ]},
    { nombre: 'Disponibilidad de servicios públicos', subs: [
      { nombre: 'No tiene acceso a servicios públicos',                                                                                                                                          pct: 0     },
      { nombre: 'Tiene conexión a energía eléctrica o tiene su propio sistema de autoabastecimiento',                                                                                            pct: 3.125 }, // 10/320
      { nombre: 'Tiene conexión a energía eléctrica o tiene su propio sistema de autoabastecimiento y 1 servicio público adicional sea acueducto, alcantarillado, o telecomunicaciones',         pct: 6.25  }, // 20/320
      { nombre: 'Tiene conexión a energía eléctrica o tiene su propio sistema de autoabastecimiento y 2 servicios públicos adicionales entre acueducto, alcantarillado, o telecomunicaciones',  pct: 9.375 }, // 30/320
      { nombre: 'Tiene conexión a energía eléctrica o tiene su propio sistema de autoabastecimiento y a acueducto, alcantarillado, y telecomunicaciones',                                       pct: 12.5  }, // 40/320
    ]},
  ],

  // ── Criterio 3: Accesibilidad vial (240 pts) ────────────────────────
  [
    { nombre: 'Tipo de la vía principal', subs: [
      { nombre: 'Terciaria (vías de acceso que unen las cabeceras municipales con sus veredas o unen veredas entre sí)',                                                                                                                                                    pct: 4.17  }, // 10/240
      { nombre: 'Secundaria (vías que unen las cabeceras municipales entre sí y/o que provienen de una cabecera municipal y conectan con una carretera primaria)',                                                                                                          pct: 8.33  }, // 20/240
      { nombre: 'Primaria (troncales, transversales y accesos a capitales de Departamento que cumplen la función básica de integración de las principales zonas de producción y consumo del país)', pct: 16.67 }, // 40/240
    ]},
    { nombre: 'Condiciones de la vía principal', subs: [
      { nombre: 'Sin pavimentar',                pct: 0      },
      { nombre: 'Pavimentada en mal estado',      pct: 4.17   }, // 10/240
      { nombre: 'Pavimentada en regular estado',  pct: 8.33   }, // 20/240
      { nombre: 'Pavimentada en buen estado',     pct: 16.67  }, // 40/240
    ]},
    { nombre: 'Pendiente de la vía principal', subs: [
      { nombre: 'Terreno escarpado (pendientes transversales generalmente superiores a 40°)',                                                                                 pct: 0      },
      { nombre: 'Terreno montañoso (pendientes transversales entre 13° y 40°, pendientes longitudinales entre 6% y 8%)',                                                      pct: 4.17   }, // 10/240
      { nombre: 'Terreno ondulado (pendientes transversales entre 6° y 13°, pendientes longitudinales entre 3% y 6%)',                                                        pct: 8.33   }, // 20/240
      { nombre: 'Terreno plano (pendientes transversales menores de 5°, pendientes longitudinales normalmente menores de 3%)',                                                 pct: 16.67  }, // 40/240
    ]},
    { nombre: 'Condiciones de la vía de aproximación', subs: [
      { nombre: 'Sin pavimentar',                pct: 0      },
      { nombre: 'Pavimentada en mal estado',      pct: 4.17   }, // 10/240
      { nombre: 'Pavimentada en regular estado',  pct: 8.33   }, // 20/240
      { nombre: 'Pavimentada en buen estado',     pct: 16.67  }, // 40/240
    ]},
    { nombre: 'Pendiente de la vía de aproximación', subs: [
      { nombre: 'Terreno escarpado (pendientes transversales generalmente superiores a 40°)',                                                                                 pct: 0      },
      { nombre: 'Terreno montañoso (pendientes transversales entre 13° y 40°, pendientes longitudinales entre 6% y 8%)',                                                      pct: 4.17   }, // 10/240
      { nombre: 'Terreno ondulado (pendientes transversales entre 6° y 13°, pendientes longitudinales entre 3% y 6%)',                                                        pct: 8.33   }, // 20/240
      { nombre: 'Terreno plano (pendientes transversales menores de 5°, pendientes longitudinales normalmente menores de 3%)',                                                 pct: 16.67  }, // 40/240
    ]},
    { nombre: 'Número de vías de aproximación', subs: [
      { nombre: 'No hay vías',   pct: 0      },
      { nombre: '1 vía',         pct: 4.17   }, // 10/240
      { nombre: '2 vías',        pct: 8.33   }, // 20/240
      { nombre: '3 o más vías',  pct: 16.67  }, // 40/240
    ]},
  ],

  // ── Criterio 4: Impacto ambiental (160 pts) ─────────────────────────
  [
    { nombre: 'Dirección de los vientos', subs: [
      { nombre: 'Dirección en sentido del casco urbano más cercano',          pct: 0    },
      { nombre: 'Dirección en sentido contrario a la población más cercana',  pct: 50   }, // 80/160
    ]},
    { nombre: 'Geoformas del área', subs: [
      { nombre: 'Zona plana y abierta',                          pct: 6.25   }, // 10/160
      { nombre: 'Zona en media ladera abierta',                  pct: 12.5   }, // 20/160
      { nombre: 'Zona en media ladera parcialmente encajonada',  pct: 18.75  }, // 30/160
      { nombre: 'Zona quebrada y encajonada',                    pct: 25     }, // 40/160
    ]},
    { nombre: 'Densidad poblacional en el área', subs: [
      { nombre: 'Mayor de 5 habitantes/hectárea',                           pct: 0    }, // 0/160
      { nombre: 'Entre 2,1 habitantes/hectárea a 5 habitantes/hectárea',    pct: 25   }, // 40/160
      { nombre: 'Entre 0 habitantes/hectárea a 2 habitantes/hectárea',      pct: 50   }, // 80/160
    ]},
    { nombre: 'Incidencia en el tráfico en la vía principal', subs: [
      { nombre: 'Alta',      pct: 6.25   }, // 10/160
      { nombre: 'Moderada',  pct: 12.5   }, // 20/160
      { nombre: 'Baja',      pct: 18.75  }, // 30/160
      { nombre: 'Ninguna',   pct: 25     }, // 40/160
    ]},
  ],

  // ── Criterio 5: Viabilidad económica (120 pts) ──────────────────────
  [
    { nombre: 'Distancia entre la estación, el municipio y la PSTRSI', subs: [
      { nombre: 'Más de 50 kilómetros',        pct: 0      },
      { nombre: 'Entre 25,1 a 50 kilómetros',  pct: 8.33   }, // 10/120
      { nombre: 'Entre 10,1 a 25 kilómetros',  pct: 16.67  }, // 20/120
      { nombre: 'Menor a 10 kilómetros',        pct: 33.33  }, // 40/120
    ]},
  ],

];