# Frontend separation of concerns

- Keep business logic in custom hooks under `src/hooks`, grouped by feature.
- Pages and UI components render hook results and connect events to hook handlers.
- Hooks own API orchestration, validation decisions, totals, filtering, sorting,
  form state transitions, and navigation after business actions.
- Keep HTTP transport in APIs/repositories; UI must not call them directly.
- Pure helpers may be shared by hooks. UI may format values and handle visual
  behavior such as focus, native pickers, and dialog keyboard interactions.
- Preserve existing behavior and design when refactoring.
