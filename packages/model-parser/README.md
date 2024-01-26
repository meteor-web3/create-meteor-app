<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://avatars.githubusercontent.com/u/118692557?s=200&v=4" width="180" alt="Meteor logo">
</a >
</p >
<br/>

# model-parser

[![npm version](https://img.shields.io/npm/v/@meteor-web3/model-parser.svg)](https://www.npmjs.com/package/@meteor-web3/model-parser)
![npm](https://img.shields.io/npm/dw/@meteor-web3/model-parser)
[![License](https://img.shields.io/npm/l/@meteor-web3/model-parser.svg)](https://github.com/meteor-web3/hooks/blob/main/LICENSE.md)

## Overview

When developers run in a existing meteor app.

```
meteor deploy
```

`output/app.json` will be generated locally, which contains various detailed
information about this deployed app.

In the data structure of this JSON, some properties such as `modelId` may have
nested levels, so the `model-parser` package is needed to facilitate developers
in retrieving key information from `output/app.json`.

This package will be automatically included in package dependencies of the
inited(`meteor init <app>`) meteor app project.

## Install

```
pnpm install @meteor-web3/model-parser
```
