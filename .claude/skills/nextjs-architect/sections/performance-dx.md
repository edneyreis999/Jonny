# Performance e DX

- Performance:
  - Suspense com fallbacks locais; streaming onde fizer sentido.
  - `dynamic()` para componentes pesados (gráficos, editores).
  - Otimizar fontes com `next/font`; imagens com `next/image` (WebP, width/height, lazy).
  - Monitorar Web Vitals (LCP, CLS, INP); evitar layout shift.
- DX:
  - ESLint strict; evitar `any`; regras para hooks/nomes.
  - `.cursorrules` alinhado à arquitetura (features, RSC, shadcn).
  - Commits pequenos e descritivos.
  - Testes mínimos: RTL/Jest para fluxos críticos; mocks para chamadas externas.
