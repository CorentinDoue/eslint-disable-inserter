# eslint-disable-inserter

Easily insert `eslint-disable-next-line` comments into your code.

[![npm version](https://badge.fury.io/js/eslint-disable-inserter.svg)](https://badge.fury.io/js/eslint-disable-inserter)
[![CI-CD](https://github.com/CorentinDoue/eslint-disable-inserter/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/CorentinDoue/eslint-disable-inserter/actions/workflows/ci-cd.yml)

When moving to a new ESLint config, or when adopting ESLint for the first time,
it's common to have tons of violations that you want to silence for now.

This library exposes a helpful utility, `eslint-disable-inserter`, that will
do all the heavy lifting, and insert `// eslint-disable-next-line ...` or `{/* eslint-disable-next-line ... */}` comments
into your code.

It handles JSX detection, and will insert the correct comment in the correct places.

This utility is idempotent, so it can be used each time you add a new ESlint rule.

## Example (Before/After)

With the following file, which has some violations and a existing comment:

```tsx
export const MyComponent = () => {
  let count = 0
  count += 1
  const messages: any = undefined
  return (
    <div>
      <h1>MyComponent</h1>
      <p>Count: {count + messages.myMessage}</p>
      {/* eslint-disable-next-line eqeqeq -- my comment */}
      <p>Is Zero: {count == 0 ? messages.yes : messages.no}</p>
    </div>
  )
}
```

Running the following command:

```bash
eslint --format json . | eslint-disable-inserter
```

Will transform the file to:

```tsx
export const MyComponent = () => {
  let count = 0
  count += 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME
  const messages: any = undefined
  return (
    <div>
      <h1>MyComponent</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- FIXME */}
      <p>Count: {count + messages.myMessage}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, eqeqeq -- FIXME my comment */}
      <p>Is Zero: {count == 0 ? messages.yes : messages.no}</p>
    </div>
  )
}
```

## Installation

```bash
yarn add --dev eslint-disable-inserter
```
or
```bash
pnpm install -D eslint-disable-inserter
```

## Usage

In your `package.json`, add the following script:

```json
{
  "scripts": {
    "eslint:insert-disables": "eslint --format json . | eslint-disable-inserter"
  }
}
```

Alternatively, you can install it globally and do the piping in your shell.

## Previewing your changes

The `--dry-run` / `-d` flag will prevent any filesystem writes, and will instead
print the modified files to stdout for you to inspect.

## Prevent FIXME addition

The `--no-fix-me` flag will to prevent addition of `-- FIXME` along with the `eslint-disable-next-line` comment

## Special rules handled

### `max-lines`

The max lines error is not tied to a specific line of code but at a position in the file. 
When encountered, the comment will be inserted at the right position in the file. 
Not just before the line that triggered the error as it's done with the other rules.

## Keep track of your errors

The aim of this is to help you improve the quality of your code. It's important to have a plan to fix those errors.

I also published a small package to easily keep track of the eslint errors of your codebase: [eslint-disabled-stats](https://www.npmjs.com/package/eslint-disabled-stats)

## License

MIT
