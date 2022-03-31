Bcc Serialization Lib
=========================

This is a library for serialization & deserialization of data structures
used in Bcc’s Haskell implementation of Aurum along with useful
utility functions.

How can I use this library
--------------------------

Rust is wonderfully portable! You can easily bind to the native Rust
library from any common programming language (even C and WebAssembly)!

NPM packages
''''''''''''

-  `NodeJS WASM package`_
-  `Browser (chrome/firefox) WASM package`_
-  `Browser (pure JS - no WASM) ASM.js package`_

Mobile bindings
'''''''''''''''

-  `React-Native mobile bindings`_

Benefits of using this library
------------------------------

Serialization/deserialization code is automatically generated from
Bcc’s official specification, which guarantees it can easily stay up
to date! We do this using an THE-BLOCKCHAIN-COMPANY-written tool called `cddl-codegen`_
which can be re-used for other tasks such as automatically generate a
Rust library for Bcc metadata specifications!

It is also very easy to create scripts in Rust or WASM to share with
stake pools, or even embed inside an online tool! No more crazy
bcc-cli bash scripts!

Powerful and flexible enough to be used to power wallets and exchanges!
(Yes, it’s used in production!)

Documentation
-------------

This library generates both `Typescript`_ and `Flow`_ type definitions,
so it’s often easiest to see what is possible by just looking at the
types! You can find the Flow types `here`_

You can also look in the `example`_ folder to see how to use this
library from Typescript or just experiment with the library.

What about other versions of Bcc?
-------------------------------------

If you are looking for legacy bindings, you can find them at the
following:

-  `Cole WASM bindings`_
-  `Quibitous WASM bindings`_

Original binary specifications
------------------------------

Here are the location of the original `CDDL`_ specifications:

- Aurum:
   `link <https://github.com/The-Blockchain-Company/bcc-ledger/tree/master/eras/aurum/test-suite/cddl-files>`__
-  Sophie:
   `link <https://github.com/The-Blockchain-Company/bcc-ledger/tree/master/eras/sophie/test-suite/cddl-files>`__
-  Jen:
   `link <https://github.com/The-Blockchain-Company/bcc-ledger/tree/master/eras/sophie-ma/test-suite/cddl-files>`__
-  Cole:
   `link <https://github.com/The-Blockchain-Company/bcc-ledger/tree/master/eras/cole/cddl-spec>`__

Building
--------

If you need to install Rust, do the following:

::

   curl https://sh.rustup.rs -sSf | sh -s -- -y
   echo 'export PATH=$HOME/.cargo/bin/:$PATH' >> $BASH_ENV
   rustup install stable
   rustup target add wasm32-unknown-unknown --toolchain stable
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

To build this repository, do the following:

::

   git submodule update --init --recursive
   nvm use
   npm install
   npm run rust:build-nodejs

Testing
-------

::

   npm run rust:test

Publishing
----------

To publish a new version to [crates.io](https://crates.io)
::

   npm run rust:publish

.. _Crates package: https://crates.io/crates/bcc-serialization-lib

To publish new versions to NPM (only needed if you are an admin of this project)
::

   npm run js:publish-nodejs
   npm run js:publish-browser
   npm run js:publish-asm

.. _NodeJS WASM package: https://www.npmjs.com/package/@theblockchaincompanyio/bcc-serialization-lib-nodejs
.. _Browser (chrome/firefox) WASM package: https://www.npmjs.com/package/@theblockchaincompanyio/bcc-serialization-lib-browser
.. _Browser (pure JS - no WASM) ASM.js package: https://www.npmjs.com/package/@theblockchaincompanyio/bcc-serialization-lib-asmjs
.. _React-Native mobile bindings: https://github.com/The-Blockchain-Company/react-native-haskell-sophie
.. _cddl-codegen: https://github.com/The-Blockchain-Company/cddl-codegen
.. _Typescript: https://www.typescriptlang.org/
.. _Flow: https://flow.org/
.. _here: /rust/pkg/bcc_serialization_lib.js.flow
.. _example: /example
.. _Cole WASM bindings: https://github.com/The-Blockchain-Company/js-bcc-wasm/tree/master/bcc-wallet
.. _Quibitous WASM bindings: https://github.com/the-blockchain-company/js-chain-libs
.. _CDDL: http://cbor.io/tools.html
.. _link: https://github.com/The-Blockchain-Company/bcc-ledger-specs/tree/master/cole/cddl-spec
