# Elecciones: simulador provincial

Aplicacion web estatica para explorar como cambia el reparto de escanos del Congreso cuando las fuerzas progresistas concurren en una lista unificada.

La aplicacion permite:

- Comparar el resultado provincial separado con una lista unificada.
- Editar porcentajes de las candidaturas del escenario unificado sin superar el 100%.
- Consultar los cocientes D'Hondt y la distancia aproximada al siguiente escano.
- Ver un orden orientativo de puestos internos para los socios de la lista.
- Probar escenarios rapidos nacionales y simular coaliciones en cada provincia.

## Datos y metodologia

Los datos del Congreso corresponden a las elecciones generales del 23 de julio de 2023 y proceden del [BOE-A-2023-18907](https://www.boe.es/diario_boe/xml.php?id=BOE-A-2023-18907).

El reparto se calcula por circunscripcion con el metodo D'Hondt y el umbral provincial del 3% de votos validos. La aplicacion es una herramienta de exploracion: los escenarios editables no son una prediccion electoral.

## Ejecutar localmente

No necesita instalar dependencias. Desde esta carpeta:

```sh
python3 -m http.server 8000
```

Abre <http://localhost:8000>.

## Publicar en Firebase Hosting

La aplicacion se publica en Firebase Hosting con:

```sh
firebase deploy --only hosting
```

El sitio esta disponible en:

```text
https://izquierda-unificada.web.app
```

## Licencia

MIT License. Copyright (c) 2026 Guillermo Cano Soto. Consulta [LICENSE](LICENSE) para los terminos completos.

Para preguntas, sugerencias o colaboraciones, usa el formulario de contacto de la web.

## Atribuciones de terceros

- Los shapes del mapa proceden de [spain-map-repo](https://github.com/...) (c) 2012 Javier Toledo, bajo licencia **MIT** (ver `spain-map-repo/LICENSE`).
- Los datos electorales proceden del [BOE-A-2023-18907](https://www.boe.es/diario_boe/xml.php?id=BOE-A-2023-18907) (datos publicos oficiales).
