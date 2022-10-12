# vite-plugin-web-config

[![NPM version](https://img.shields.io/npm/v/vite-plugin-web-config?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-web-config)

- Configure vite server proxy in development mode.
- In build mode, it will generate `web.config` (IIS server config) file with rewrite rules in the `dist` directory.

## Install

```bash
# npm
npm i vite-plugin-web-config -D

# yarn
yarn add vite-plugin-web-config -D

# pnpm
pnpm add vite-plugin-web-config -D
```

## Usage

Add plugin to `vite.config.ts`:

```ts
import WebConfig from 'vite-plugin-web-config'

export default {
  plugins: [
    WebConfig({
      proxy: [['/api', 'http://localhost:3000']],
      output: 'web.config',
    }),
  ],
}
```

### Options

| Name   | Type                 | Default      | Description       |
| ------ | -------------------- | ------------ | ----------------- |
| proxy  | `[string, string][]` | `[]`         | Proxy list config |
| output | `string \| false`    | `web.config` | Output file name. |

Except for the above options, you can also configure `VITE_PROXY` in `.env.*` file:

```env
VITE_PROXY = [["/api","http://localhost:3000"]]
```

> Must be a valid JSON string.  
> If provide `proxy` option, `.env.*` config will be ignored.  
> When `output` is `false`, it will not generate `web.config` file.

In development mode, vite will automatically configure the proxy according to the configuration in the `.env.*` file or `options.proxy`.

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

After running `vite build`, the `web.config` file will be generated in the `dist` directory.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="api_rule" stopProcessing="true">
          <match url="api/(.*)"/>
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_URI}" pattern="api/(.*)"/>
          </conditions>
          <action type="Rewrite" url="http://localhost:3000/{R:1}" logRewrittenUrl="true"/>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Example

- [vite-vanilla-example](./example)

## License

[MIT](./LICENSE) License © 2022 [qianphong](https://github.com/qianphong)
