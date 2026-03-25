# feature-flags

Lightweight, zero-dependency feature-flag utility for toggling features at runtime or build time.

## Usage

```js
import isEnabled from "feature-flags";

if (isEnabled("competition")) {
  // feature is enabled
}
```

### Runtime configuration

```js
import { configureFeatureFlags } from "feature-flags";

configureFeatureFlags({ FEATURE_COMPETITION: true });
```

## Resolution Order

| Priority | Source         | Example                                      |
| -------- | -------------- | -------------------------------------------- |
| 1        | Runtime config | `configureFeatureFlags({ FEATURE_X: true })` |
| 2        | Vite env vars  | `VITE_FEATURE_X=true` in `.env`              |
| 3        | Node env vars  | `FEATURE_X=true`                             |

A flag is enabled when its value is `true` or `"true"`.

## API

| Export                         | Description                                |
| ------------------------------ | ------------------------------------------ |
| `default isEnabled(name)`      | Returns `boolean` — whether the flag is on |
| `configureFeatureFlags(flags)` | Merges flags into runtime config           |
