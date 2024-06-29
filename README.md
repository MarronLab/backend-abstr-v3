# Maroon

## Overview

Maroon represents the evolution of hybrid digital asset exchanges, prioritizing your ownership without any compromise. Our platform integrates self-custodial smart wallets, ensuring you maintain absolute control over your funds, with keys securely in your possession. With seamless authentication via your preferred social login, bid farewell to the hassle of managing private keys or seed phrases. Utilizing a multi-signature architecture, every transaction, be it withdrawals or order placements, requires a 2-of-2 signing solution, empowering users to govern their transactions.


## Technology Stack

- [Next.js](https://nextjs.org/)
- [Nest.js](https://nestjs.com/)
- [PostgreSQL](https://postgresql.org/)
- [Coinbase Smart Wallet](https://www.coinbase.com/wallet/smart-wallet/)
- [Base](https://www.base.org/)

## Core Components, Protocols, and Architecture

Maroon's architecture revolves around empowering users while ensuring seamless transactions. Through the Capsule wallet integration, utilizing Create2, we predict a secure address, constituting a 2-of-2 multisignature, blending the user's Capsule wallet address with our platform's. Users fund this safe address with tokens for trading. When placing orders, users sign three transactions which are also co-signed by our platform: safe deployment, token allowance for the 0x contract, and the order itself, including the RegisterAllowedSignature transaction authorizing Maroon to sign orders on their behalf. Orders sent to the Matching Engine undergo bundling if matching occurs, consolidated into a single transaction sent to the Entry Point contract for processing.

![Architecture Diagram](https://res.cloudinary.com/ddo5l4trk/image/upload/v1715441120/Untitled_Diagram.drawio_sey3od.png)

_Architecture Diagram of Core Components_

### Maker/Taker

The user-controlled wallet (Maker/Taker) acts as Key 1 for signing trade orders before submission.

### Maroon

Maroon's wallet (Platform) co-signs all transactions initiated by the Maker/Taker, ensuring security and integrity.

### JS Matching Engine

Responsible for matching and storing orders in the order book, the engine adeptly handles partial and full order matching.

### Entry Point Smart Contract

Transactions are sent here for bundling before further processing, streamlining the transaction flow.

### Token Contract

The token smart contract facilitates trades and manages allowance permissions, ensuring smooth on-chain operations.

### Safe Contract

With a 2-signer threshold, the Safe Contract requires both Maroon and users' signatures, housing the tokens for trading securely.

### 0x Contract

This smart contract handles on-chain order settlements, ensuring transparency and efficiency in trade execution.

## Demo

### Live Demo Instructions

- Navigate to https://exchange-app-emms.onrender.com/ and connect your wallet!
- Click on the deposit section and fund your wallet with the trade tokens
- Buy or Sell the tokens

[Backend URL](https://backend-1ifl.onrender.com)
[Video recording](https://youtu.be/_3RzRAVbAL4)

## Other Component Repositories

- https://github.com/Maroon-io/backend/tree/feat-coinbase-integration


## Example Transaction Hash

View transaction on explorer: https://basescan.org/tx/0x39508b211a3cb899dc296c861d0d8dc59762a6623cb1db6b9dd87b5cdd8c5ba1

## Smart Contract Information

The following contracts are deployed to base blockchain and used in powering this app

```bash
ENTRY_POINT_ADDRESS="0x948E5b1dBe89127DF0339ca32Ce834904Cbd4C16"
SAFE_4337_MODULE_ADDRESS="0xF695D93017eF401cb062db4fAc072C6e6978587a"
ADD_MODULES_LIB_ADDRESS="0xc59e3dF13ab7B61fbd07ae5Ce27b375F1d4a7308"
SAFE_SINGLETON_ADDRESS="0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
SAFE_PROXY_FACTORY_ADDRESS="0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67"

```

