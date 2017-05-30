# Distributed Ledgers for Data Privacy
This repository contains code for Golab, Mack, and Webber (2017). All code has been written for [Hyperledger Composer](https://hyperledger.github.io/composer/), a system that helps abstract much of the frequently used chaincode for Hyperledger Fabric implementations.

## What's Here
The following files can be found here: 

- `lib/logic.js`: this is a library of javascript functions for use as transactions in the network. 
- `model/org.data.privacyNetwork.cto`: this is the business network model, containing all the classes for use.
- `package.json`: this is the metadata for the implementation.
- `permissions.acl`: this is the ACL file, which produces access controls. 
- `blockchain-for-data-privacy.bna`: the bna file for use with a Hyperledger Composer GUI. 

## License

MIT License

Copyright (c) 2017

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
