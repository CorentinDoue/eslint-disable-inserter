# eslint-disable-inserter

This is a fork from [eslint-ignore-inserter](https://github.com/stevenpetryk/eslint-ignore-inserter) which is no more maintained


When moving to a new ESLint config, or when adopting ESLint for the first time,
it's common to have tons of violations that you want to silence for now.

This library exposes a helpful utility, `eslint-disable-inserter`, that will
do all the heavy lifting, and insert `// eslint-disable-next-line ...` comments
into your code.

## Example (Before/After)

Say you have the following code, with an indentation violation:

```js
function example() {
  console.log("Hello")
    console.log("World!")
}
```

Assuming you have the ESLint `indent` rule turned on, running this...

```bash
eslint --format json . | eslint-disable-inserter
```

... yields this:

```js
function example() {
  console.log("Hello")
  // eslint-disable-next-line indent
    console.log("World!")
}
```

## Installation

```
$ yarn add --dev eslint-disable-inserter
```

Then, in your `package.json`, you can do something like this:

```json
{
  "scripts": {
    "eslint:insert-disbales": "eslint --format json . | eslint-disbale-inserter"
  }
}
```

Alternatively, you can install it globally and do the piping in your shell.

## Previewing your changes

The `--dry-run` / `-d` flag will prevent any filesystem writes, and will instead
print the modified files to stdout for you to inspect.

## Add FIXME to be more explicit

The `--add-fix-me` / `-f` flag will add `// FIXME` along with the `// eslint-disable-next-line`
## License

MIT
