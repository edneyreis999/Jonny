# Loki Init - Game Designer Inventory - Regras e mecanicas

Source index: [inventory.md](inventory.md)

## Regras e mecanicas

| Superficie | Estado factual | Tipo de evidencia |
| --- | --- | --- |
| Cena `Sinal` | Safe = Parar; Risk = Furar; timer documentado 4,0s; CE7 usa 240 frames. | Design doc + CommonEvents parse-valid. |
| Cena `Curva` | Safe = Esquerda; Risk = Direita; timer documentado 3,5s; CE7 usa 210 frames. | Design doc + CommonEvents parse-valid. |
| Risk formula | `taxa = clamp(Consciência + P_cena, 0, 100)`; roll `0..99`; sucesso se roll < taxa. | Design doc + CE12 script inline. |
| Safe reward | `+10` Consciência, `+10` Pontos de Gloria, avanca cena. | Design doc + CE11 variables. |
| Risk reward | Sucesso soma `P_cena * 2` Pontos de Gloria; falha chama crash/result flow. | Design doc + CE12 script inline. |
| Resource reset | Consciência e Pontos de Gloria zeram no init da corrida; retry incrementa tentativa. | CE5 parse-valid. |
| Thresholds | Metas atuais 200, 400, 600 por `VAR_RACE_ID` 1, 2, 3. | Core loop + CE5/CE19 scripts inline. |
| Curva do Diabo | Documentada como visao completa e adiada no MVP, mas CE7 contem branch para corrida 3 cena 9 com `P_cena=100`. | Drift entre docs + CommonEvents parse-valid. |
| Timeout | TL;DR e edge cases indicam safe automatico; secao 7.1 ainda diz erro fatal; CE10 chama CE11 safe. | Conflito documental + CommonEvents parse-valid. |
