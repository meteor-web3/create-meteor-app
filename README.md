<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://avatars.githubusercontent.com/u/118692557?s=200&v=4" width="180" alt="Meteor logo">
</a >
</p >
<br/>

# Create Meteor App

## Overview

This repository contains command-line tool and other convenient user-friendly
package for developers to build a meteor app.

## meteor-cmd

[![npm version](https://img.shields.io/npm/v/create-meteor-app.svg)](https://www.npmjs.com/package/create-meteor-app)
![npm](https://img.shields.io/npm/dw/create-meteor-app)
[![License](https://img.shields.io/npm/l/create-meteor-app.svg)](https://github.com/meteor-web3/hooks/blob/main/LICENSE.md)

A command-line tool enable developers to init a meteor app project and deploy
to Dataverse OS.

```
pnpm install -g create-meteor-app
```

After installation, use `--help` to see more features.

```
meteor --help
```

This command-line tool is the entry point for interacting with Dataverse OS.
Developers who want to access the powerful features of Dataverse OS need to
install it.

## model-parser

[![npm version](https://img.shields.io/npm/v/@meteor-web3/model-parser.svg)](https://www.npmjs.com/package/@meteor-web3/model-parser)
![npm](https://img.shields.io/npm/dw/@meteor-web3/model-parser)
[![License](https://img.shields.io/npm/l/@meteor-web3/model-parser.svg)](https://github.com/meteor-web3/hooks/blob/main/LICENSE.md)

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

## dapp-table-client

[![npm version](https://img.shields.io/npm/v/@meteor-web3/dapp-table-client.svg)](https://www.npmjs.com/package/@meteor-web3/dapp-table-client)
![npm](https://img.shields.io/npm/dw/@meteor-web3/dapp-table-client)
[![License](https://img.shields.io/npm/l/@meteor-web3/dapp-table-client.svg)](https://github.com/meteor-web3/hooks/blob/main/LICENSE.md)

This is a client for retrieving Meteor DApp information, creating Meteor
DApps, and updating Meteor DApps. The main exposed methods are as follows:

- getFileSystemModels
- getDapp
- getDapps
- createDapp
- updateDapp
