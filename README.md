# qlik-sense-user-agent

A nebula extension (named `user-agent-reporter`) which tracks the user's user agent
and redirects them to a new Qlik Sense session identity if conditions are met.

This does some simple handling for native usage of Qlik Cloud Analytics, but
is unlikely to work as expected in web apps/ mashups.

## Usage

Build the extension and upload it to Qlik Sense. Add the `User Agent Reporter` to
a sheet. When the user opens a sheet containing the extension object, a session variable
named `vUserAgent` will be set to the reported user agent, for example
`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`.

If you wish to check for a mobile browser, add a condition such as
`=Alt(INDEX(vUserAgent,'Mobi'),0)=0` to a sheet, chart, or field. This attempts to
evaluate the variable, and if unable to, returns 0 to show the object.

The extension will attempt to isolate clients into an identity:

- If a mobile client, the identity will be set to `mobile`. Any mobile sessions will
  share this identity.
- If a web client, and no identity is set, no changes will be made. If the identity
  has been set to `mobile`, it will be overwritten by `web`.

Notes:

- The `vUserAgent` variable should not be set in the app.
- Since this sets a session variable, this is maintained on the engine session by
the engine. As such, multiple clients accessing the app with the same user will each
cause an update of the user agent in the order in which they make updates.

## Building

To build for Qlik Sense & create extension zip.

```js
npm install
npm run build
npm run sense
zip -r user-agent-reporter.zip user-agent-reporter-ext
```

## Releasing with this repo

Use the `Create Release` workflow to generate the extension asset and draft a release.
Ensure you have updated the version before building, as if the tag already exists
the workflow will exit with an error.
