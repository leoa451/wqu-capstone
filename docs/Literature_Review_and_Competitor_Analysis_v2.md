# LITERATURE REVIEW AND COMPETITOR ANALYSIS

MScFE Capstone Project

Group 17859

Date: 26/09/2026

---

## Problem Statement

The challenge for portfolio managers is to convert shifting market information into monthly allocations that meet risk and turnover constraints while accounting for transaction costs. This project asks whether a causal transformer-based world model can improve the out-of-sample risk-adjusted performance of those allocations over simple baseline portfolios.

The model will learn monthly market-state transitions from public price, volume and volatility data for all 21 selected instruments. Macroeconomic and text-based inputs are optional.

Indicator-specific asset-by-time panels (derived modalities) will carry levels scaled to [0, 1] together with directional information. Dedicated encoders will process those panels before their representations are fused.

A constrained allocation method will use next-month return forecasts and risk estimates. It will generate long-only, fully invested and unleveraged monthly weights subject to maximum asset-weight and turnover limits and a portfolio volatility target.

The model will be compared with equal-weight, volatility-scaled risk-parity and external 60/40 SPY/AGG portfolios during a later period excluded from training and model selection (AGG provided separately). All portfolios will use one fixed transaction-cost assumption. Results without a clear advantage will be reported without claiming improvement.

## Literature Review

This review covers simple baselines, machine learning for return forecasts, attention models, indicator representations and backtest costs. It then places the proposed project among the approaches reviewed.

## Simple baselines are not easy to outdo

According to Markowitz's model, portfolio choice is a trade-off between expected return and risk (77-91). Estimated returns and covariances may be inaccurate.

DeMiguel, Garlappi and Uppal compared 14 estimation-based allocation models with the 1/N rule (1915-1953). None performed consistently better in their tests of Sharpe ratio, certainty-equivalent return and turnover. Equal weighting is a challenging baseline for this project.

Jagannathan and Ma found that prohibiting short selling can act in a way similar to shrinking covariance estimates (1651–84). The long-only rule may therefore reduce estimation error as well as restrict portfolio holdings.

These portfolio-selection studies examine return and risk outcomes. This project will also report whether the resulting weights meet its stated allocation constraints.

## The use of machine learning to predict returns

Gu, Kelly and Xiu studied several machine-learning methods for predicting returns. Trees and neural networks performed well because they can capture nonlinear interactions among predictors (2223-73).

Monthly out-of-sample R² gains can still be small, and predictive results differ across assets. Kelly and Xiu also describe how the reported gains depend on the study's design (205-363).

The 21-instrument universe in this project is much smaller than the stock samples in those studies. Monthly observations and shorter histories for some instruments limit training data, so those findings do not establish whether a causal transformer will improve allocation here.

Vaswani et al. developed the transformer using self-attention rather than recurrence. Causal masking can keep a model from using later observations. Lim et al.'s Temporal Fusion Transformer distinguishes static, known-future and observed inputs and offers a related time-series design (1748-64).

Zeng et al. found that a one-layer linear model outperformed several Transformer forecasters on nine long-term time-series benchmarks (11121-28). They argued that self-attention may lose temporal order even when positional information is included.

Nie et al. used patches as tokens in PatchTST and shared model weights across channels. Liu et al.'s iTransformer instead represents each variable's history as a token, then uses attention to model relationships between variables.

Ding et al. use Transformer forecasts in a separate portfolio-construction process for 28 ETFs. They compare the resulting allocations with equal-weight, 60/40 and risk-parity portfolios, including tests after transaction costs.

Ha and Schmidhuber use a world model within an agent's learning system. The term has a narrower meaning in this project: a model of monthly market-state transitions that produces forecasts without an agent or simulated trading environment.

## Representing indicators as modalities

Sezer and Ozbayoglu represent technical indicators as 15x15 images for a convolutional network (525-38). This is a structured indicator input, but the study concerns classification rather than allocation across a multi-asset panel.

The proposed asset-by-time panel keeps its asset and time axes explicit. It also permits the model to process several assets within one indicator representation.

Jiang, Kelly and Xiu learn return-predictive patterns from stock price-chart images rather than fixing momentum or reversal patterns in advance (3193–3249). Their stock results do not show that fixed indicator-level panels improve allocation in this project's instrument universe.

The proposed modalities share much of the same underlying price and volume data. Dedicated encoders are a structural choice, not a source of independent information. If time permits, the project will compare dedicated encoders with a shared encoder using matched inputs and model capacity.

## Cost and Testing

Bailey et al. show that testing many parameter combinations raises the chance of selecting a model that looks good in sample but performs poorly out of sample (39-69). The number of configurations examined should therefore be recorded.

Novy-Marx and Velikov report that most tested stock anomalies with less than 50 percent monthly turnover retained significant net spreads when designed to limit trading costs (104-47). Few of their higher-turnover anomalies did so, and this finding applies to their tested strategies and cost rules.

Turnover is an explicit constraint in this project. The evaluation will also report portfolio performance after the fixed transaction-cost assumption.

Zhang, Zohren and Roberts train a model to produce portfolio weights directly under a Sharpe-ratio objective (8-20). This is an alternative to keeping forecasts and allocations separate. The proposed allocation method keeps the two steps apart so that their outputs and the final weights' constraints can be checked.

## Literature Review Conclusion

The cited work raises three concerns for this project. Estimation error can weaken portfolio optimization, gains from machine-learning forecasts may be modest, and forecast accuracy alone does not establish allocation value after costs.

Ding et al. already test Transformer forecasts followed by ETF allocation against simple baselines, including comparisons after costs. This project asks a narrower question about indicator-specific asset-by-time panels and constrained monthly allocation across its selected 21 instruments.

The project will report net portfolio performance and compliance with its weight, turnover and volatility rules. A dedicated-versus-shared encoder comparison may be included if time permits. A failure to outperform 1/N would also be informative under the tested conditions, given the result reported by DeMiguel, Garlappi and Uppal (2009).

## Competitor Analysis and Business Case

This research prototype is intended to let portfolio managers inspect monthly weights, costs, constraint compliance and performance in one place. It combines forecasting, constrained allocation and baseline comparison in one repeatable workflow.

Existing approaches include equal weighting, direct model-based weight selection and forecast-led ETF allocation. DeMiguel, Garlappi and Uppal show why equal weighting is a serious comparator, while Ding et al. give an example of forecast-led allocation.

The product hypothesis is that portfolio managers would find value in reviewing these outputs together. If the prototype were later developed as a product, interviews with intended users and a small pilot could test whether the workflow helps them review allocation decisions.

Those activities are outside the capstone's scope. Market demand has not been established.

### Review of competing work

The opportunities and threats below concern each competing approach. They are possible extensions or limits, not measured market outcomes.

| Competing work | Strength | Weakness | Opportunity | Threat |
| --- | --- | --- | --- | --- |
| Ding et al., Transformer forecasts with portfolio ranking | Tests forecast-led ETF allocation against portfolio baselines, including costs. | The reported out-of-sample period is 51 months, and the sample contains ETFs rather than this project's full asset mix. | Its ranking method could be tested with other asset mixes and allocation rules. | Simpler portfolio rules or other forecast models may match its net results in a different period. |
| Zhang, Zohren and Roberts, direct portfolio optimization | Learns portfolio weights directly. | Forecast quality and allocation quality cannot be assessed as separate steps. | Its direct objective could be extended to show constraint compliance and cost effects. | A transparent two-step method may be easier to inspect if it achieves similar net results. |
| Sezer and Ozbayoglu, indicator-image CNN | Tests a structured technical-indicator input. | Its classification task does not establish multi-asset monthly allocation performance. | Indicator representations could be tested in a portfolio setting. | Direct use of price histories or other representations may work as well without fixed indicator images. |

Zhang, Zohren and Roberts learn weights directly, while this project keeps forecasts and allocation separate. Sezer and Ozbayoglu test indicator images for classification; this project retains the asset and time axes for monthly portfolio decisions.

Ding et al. already combine Transformer predictions with ETF allocation and compare portfolios after costs. This project does not claim that a two-step structure is new. It tests its chosen indicator panels and portfolio rules on the selected 21 instruments, then reports the weights' compliance and net performance without assuming an advantage.

---

## Initial Findings and Result Status

The reviewed studies show that equal weighting is a demanding comparator and that forecast gains alone do not establish an allocation benefit after costs.

The competitor analysis identifies a narrower test of indicator-specific panels and constrained monthly allocation. No model-training or portfolio-backtest results are reported in this review.

## Bibliography

Bailey, David H., et al. "The Probability of Backtest Overfitting." *Journal of Computational Finance*, vol. 20, no. 4, 2017, pp. 39–69. doi:10.21314/JCF.2016.322.

DeMiguel, Victor, et al. "Optimal Versus Naive Diversification: How Inefficient Is the 1/N Portfolio Strategy?" *The Review of Financial Studies*, vol. 22, no. 5, 2009, pp. 1915–53. doi:10.1093/rfs/hhm075.

Ding, Ding, et al. "Dynamic Multi-Criteria Portfolio Selection Integrating Transformer-Based Financial Forecasting with Peer-Prediction Trees." *Mathematics*, vol. 14, no. 13, 2026, article 2287. doi:10.3390/math14132287.

Gu, Shihao, et al. "Empirical Asset Pricing via Machine Learning." *The Review of Financial Studies*, vol. 33, no. 5, 2020, pp. 2223–73. doi:10.1093/rfs/hhaa009.

Ha, David, and Jürgen Schmidhuber. "Recurrent World Models Facilitate Policy Evolution." *Advances in Neural Information Processing Systems*, vol. 31, 2018. https://papers.nips.cc/paper/2018/hash/2de5d16682c3c35007e4e92982f1a2ba-Abstract.html.

Jagannathan, Ravi, and Tongshu Ma. "Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps." *The Journal of Finance*, vol. 58, no. 4, 2003, pp. 1651–84. doi:10.1111/1540-6261.00580.

Jiang, Jingwen, et al. "(Re-)Imag(in)ing Price Trends." *The Journal of Finance*, vol. 78, no. 6, 2023, pp. 3193–3249. doi:10.1111/jofi.13268.

Kelly, Bryan T., and Dacheng Xiu. "Financial Machine Learning." *Foundations and Trends in Finance*, vol. 13, nos. 3–4, 2023, pp. 205–363. doi:10.1561/0500000064.

Lim, Bryan, et al. "Temporal Fusion Transformers for Interpretable Multi-Horizon Time Series Forecasting." *International Journal of Forecasting*, vol. 37, no. 4, 2021, pp. 1748–64. doi:10.1016/j.ijforecast.2021.03.012.

Liu, Yong, et al. "iTransformer: Inverted Transformers Are Effective for Time Series Forecasting." *Proceedings of the Twelfth International Conference on Learning Representations*, 2024. https://proceedings.iclr.cc/paper_files/paper/2024/file/2ea18fdc667e0ef2ad82b2b4d65147ad-Paper-Conference.pdf.

Markowitz, Harry. "Portfolio Selection." *The Journal of Finance*, vol. 7, no. 1, 1952, pp. 77–91. doi:10.1111/j.1540-6261.1952.tb01525.x.

Nie, Yuqi, et al. "A Time Series Is Worth 64 Words: Long-Term Forecasting with Transformers." *Proceedings of the Eleventh International Conference on Learning Representations*, 2023. https://openreview.net/forum?id=Jbdc0vTOcoI.

Novy-Marx, Robert, and Mihail Velikov. "A Taxonomy of Anomalies and Their Trading Costs." *The Review of Financial Studies*, vol. 29, no. 1, 2016, pp. 104–47. doi:10.1093/rfs/hhv063.

Sezer, Omer Berat, and Ahmet Murat Ozbayoglu. "Algorithmic Financial Trading with Deep Convolutional Neural Networks: Time Series to Image Conversion Approach." *Applied Soft Computing*, vol. 70, 2018, pp. 525–38. doi:10.1016/j.asoc.2018.04.024.

Vaswani, Ashish, et al. "Attention Is All You Need." *Advances in Neural Information Processing Systems*, vol. 30, 2017, pp. 5998–6008.

Zeng, Ailing, et al. "Are Transformers Effective for Time Series Forecasting?" *Proceedings of the AAAI Conference on Artificial Intelligence*, vol. 37, no. 9, 2023, pp. 11121–28. doi:10.1609/aaai.v37i9.26317.

Zhang, Zihao, et al. "Deep Learning for Portfolio Optimization." *The Journal of Financial Data Science*, vol. 2, no. 4, 2020, pp. 8–20. doi:10.3905/jfds.2020.1.042.
