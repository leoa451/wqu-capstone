# MScFE 690 Capstone

Group 17859

Relevant project files will be added progressively over the course.

Track 8: Machine Learning (Deep) Investment Strategies. The project plans a research implementation of a monthly, long-only portfolio allocator. An autoregressive causal transformer will use public market data to learn monthly market-state transitions and produce next-month return forecasts and risk estimates. A constrained allocation layer will convert those forecasts into fully invested weights. The study asks whether those allocations improve out-of-sample risk-adjusted performance over simple baseline portfolios after turnover and a fixed transaction-cost assumption, while satisfying the portfolio constraints.

## Problem

Portfolio choice must balance expected return and risk, but return distributions and relationships between assets change over time, so estimates taken from past returns are unstable. The challenge is taking noisy public market data and translating it into monthly allocations that meet explicit risk limits, turnover caps, and transaction costs.

The planned model will learn monthly market-state transitions from public price, volume, and volatility. Macroeconomic and text inputs are optional. Technical indicators will form derived modalities: each modality will be an asset-by-time panel over the same universe, with indicator levels normalized to [0, 1] and with directional information. Each modality will have its own encoder before fusion. Causal attention masking will keep each decision point from observing later observations.

If a simple baseline matches or beats the model, the result will be reported as such. The planned outputs are for research decision support, not investment recommendations. A historical backtest will not guarantee future performance.

## Scope

- Decisions are monthly. Intraday, daily, and high-frequency allocation are outside the project.
- Planned inputs are exported public-market data for 21 instruments, using price, volume, and volatility. Macroeconomic and text inputs are optional. The source, export date, coverage, instrument identifiers, frequency, and timezone will be recorded. API secrets will not be stored in git, and the required ingestion path will not call external APIs.
- The world model will forecast next-month returns and risk. Order-book simulation and interaction among market participants are outside the project.
- Portfolios will be long-only, fully invested, and unleveraged. Maximum asset weight, turnover, volatility target, risk level, and the transaction-cost assumption will be user settings.
- The implementation will produce allocations and analytics. Broker execution, paper trading, live trading, private-account management, and proprietary production models are outside the project.
- The universe will be fixed before test evaluation. Training, validation, and test periods will be chronological. The test period will be excluded from training and model selection. Model and baseline comparisons will use one fixed transaction-cost assumption.

## Objectives

1. Import exported CSV files, validate them, record missing-data treatment, and store the processed data as Parquet.
2. Build indicator panels with levels scaled to [0, 1], directional information, asset identity, timestamps, and availability masks. Fitted transform parameters are estimated on the training period only and then held fixed. Features use only information available at each decision point.
3. Train the causal transformer on the fixed 21-instrument universe. Save the configuration, random seeds, and checkpoints. Use the validation period for model selection.
4. Map forecasts to long-only, fully invested, unleveraged monthly weights, and record infeasible settings or constraint violations.
5. Compare the model with an equal-weight portfolio, a fixed 60 percent SPY / 40 percent AGG portfolio, and a volatility-scaled risk-parity portfolio on the same test period and the same monthly rebalancing rules. Report return, volatility, Sharpe ratio, maximum drawdown, turnover, and constraint violations after costs.
6. Provide a simple research interface for portfolio settings and saved-run outputs, with checks for data preparation, chronological splits, decision cutoffs, constraints, and transaction costs. An optional comparison of dedicated modality encoders with a shared encoder will use the same inputs, parameter count, and tuning budget. That comparison is not required to answer the main question.

## Data

The planned primary universe is SPY, QQQ, IWM, EFA, EEM, BIL, SHY, IEF, TLT, TIP, LQD, HYG, SLV, GLD, DBC, USO, VNQ, UUP, BTCUSD, ETHUSD, and BNDX. AGG will be supplied separately for the external 60/40 SPY/AGG benchmark. Irregular histories, missing data, and the chosen time splits will be reported with the experiment.
