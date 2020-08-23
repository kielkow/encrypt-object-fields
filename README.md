# Package util for encrypt specific fields from your object

How to use?

```shell
npm i encrypt-object-fields
```

```js
const encryptObjectFields = require('encrypt-object-fields');

// -- payload
// object: {
//     field: {
//         subfield: 'this is my subfield'
//     }
//     otherfield: 'this is my other field'
// }

const encryptedObjectFields = encryptObjectFields(object, ['object.field.subfield', 'object.otherfield']);

// -- result -> payload with encrypted fields
// object: {
//     field: {
//         subfield: '65675324234kfghtnyuascfd'
//     }
//     otherfield: '345123097778amdsjnctsjdns'
// }
```

