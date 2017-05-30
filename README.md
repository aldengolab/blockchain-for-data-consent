# Distributed Ledgers for Data Privacy
This repository contains code for Golab, Mack, and Webber (2017). All code has been written for [Hyperledger Composer](https://hyperledger.github.io/composer/), a system that helps abstract much of the frequently used chaincode for Hyperledger Fabric implementations.

## What's Here
The following files can be found here: 

- `lib/logic.js`: this is a library of javascript functions for use as transactions in the network. 
- `model/org.data.privacyNetwork.cto`: this is the business network model, containing all the classes for use.
- `package.json`: this is the metadata for the implementation.
- `permissions.acl`: this is the ACL file, which produces access controls. 
- `blockchain-for-data-privacy.bna`: the bna file for use with a Hyperledger Composer GUI. 
