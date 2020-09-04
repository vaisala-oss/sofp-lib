# Sofp Library

This library is part of the Simple Observation Features Pilot WFS 3.0 project. The purpose of this library is to provide interfaces and classes for the integration of the core server and the bakcends.

The core is available at https://github.com/vaisala-oss/sofp-core

An example backend is available at https://github.com/vaisala-oss/sofp-example-backend

© 2018-2020 Vaisala Corporation

## To release

To release a new version, do the following:

1. Bump the version appropriately in package.json
2. Commit and push all changes
3. rm -r dist/
4. npm run build
5. npm publish

