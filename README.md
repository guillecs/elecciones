# Elecciones: simulador provincial

Aplicacion web estatica para explorar como cambia el reparto de escanos del Congreso cuando las fuerzas progresistas concurren en una lista unificada.

La aplicacion permite:

- Comparar el resultado provincial separado con una lista unificada.
- Editar porcentajes de las candidaturas del escenario unificado sin superar el 100%.
- Consultar los cocientes D'Hondt y la distancia aproximada al siguiente escano.
- Ver un orden orientativo de puestos internos para los socios de la lista.
- Compartir un escenario mediante una URL.

## Datos y metodologia

Los datos del Congreso corresponden a las elecciones generales del 23 de julio de 2023 y proceden del [BOE-A-2023-18907](https://www.boe.es/diario_boe/xml.php?id=BOE-A-2023-18907).

El reparto se calcula por circunscripcion con el metodo D'Hondt y el umbral provincial del 3% de votos validos. La aplicacion es una herramienta de exploracion: los escenarios editables no son una prediccion electoral.

## Ejecutar localmente

No necesita instalar dependencias. Desde esta carpeta:

```sh
python3 -m http.server 8000
```

Abre <http://localhost:8000>.

## Publicar en GitHub Pages

El workflow de `.github/workflows/pages.yml` publica automaticamente la raiz del repositorio en GitHub Pages cada vez que se actualiza `main`.

En GitHub, entra en **Settings > Pages**, selecciona **GitHub Actions** como fuente y ejecuta el workflow `Deploy static site to GitHub Pages` o haz push a `main`.

El sitio quedara disponible normalmente en:

```text
https://guillecs.github.io/elecciones/
```

## Licencia

Este proyecto se distribuye bajo la [GNU GPL v2](LICENSE).
