<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://avatars.githubusercontent.com/u/118692557?s=200&v=4" width="180" alt="Meteor logo">
</a >
</p >
<br/>

# Create Meteor App

[![npm version](https://img.shields.io/npm/v/create-meteor-app.svg)](https://www.npmjs.com/package/create-meteor-app)
![npm](https://img.shields.io/npm/dw/create-meteor-app)
[![License](https://img.shields.io/npm/l/create-meteor-app.svg)](https://github.com/meteor-web3/create-meteor-app/blob/main/LICENSE.md)

## Overview

A command-line tool enable developers to init a meteor app project and deploy
to Dataverse OS.

## Install

```
pnpm install -g create-meteor-app
```

After installation, use `--help` to see more features.

```
meteor --help
```

To check version:

```
meteor --version
```

This command-line tool is the entry point for interacting with Dataverse OS.
Developers who want to access the powerful features of Dataverse OS need to
install it.

## Command

### init

```
meteor init my-app
```

> Note: Please ensure that you have the latest version, otherwise the "init"
> operation will be terminated.

### deploy

```
cd my-app
meteor deploy
```

You need to input `private key` in this step. Please rest assured that your
private key is only used for signing, and Meteor will never save or disclose
it.

### keypair

If you want to use a new generated private key, you could run:

```
meteor keypair
```

In the terminal, `Address`, `Private Key` and `Public Key` will be displayed,
and you can copy the `Private Key` for future use.

### update

```
meteor update
```

When you modify the `meteor.config.ts`, you can update the information of the
dapp. A new generated `app.json` would store in `output` directory.
