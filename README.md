# MScFE 690 Capstone

Group 17859

This course repository contains selected work completed so far. Relevant files will be added over the course.

No model-training or portfolio-performance result is reported here yet.

## Current code

The Python example checks a small monthly CSV file for required fields, valid prices, missing values, and duplicate instrument-months. Its six rows are synthetic test data, not market evidence or a sample of the planned 21-instrument experiment.

Install the Python requirements with `python -m pip install -e '.[dev]'`. Run `python -m pytest -q`, or open [the data-intake notebook](notebooks/data_intake_smoke.ipynb) from the repository root.

The notebook also writes the synthetic rows to a temporary Parquet file. It does not train a model or run a backtest.

## Results page

The `site/` folder contains a static page prepared for GitHub Pages. Its `site/results/index.json` file has no evaluation runs at present.

Run `npm ci` and `npm run build:site` to build the TypeScript page. For a local preview, run `python -m http.server 8000 --directory site` and open `http://localhost:8000/`.

## Planned study

The project plans monthly allocations over 21 public market instruments. A causal transformer, a constrained allocation method, and comparisons with simple portfolios remain part of the planned research work.

Real market exports and generated research outputs are not included in this course snapshot. Any later published result will identify its data source, test period, assumptions, and limitations.
