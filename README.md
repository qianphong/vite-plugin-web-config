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
      // options
    }),
  ],
}
```

Config proxy in your `.env` file:

```bash
VITE_PROXY = [["/basic-api","http://localhost:3000"]]
```

In development mode, vite will automatically configure the proxy according to the configuration in the `.env` file.

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/basic-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/basic-api/, ''),
      },
    },
  },
})
```

After running `vite build`, the `web.config` file will be generated in the `dist` directory.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="basic-api" stopProcessing="true">
          <match url="^basic-api/(.*)" />
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
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
