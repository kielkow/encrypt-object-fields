# Package util for encrypt specific fields from your object

How to use?

```shell
npm i encrypt-object-fields
```

```js
const encryptObjectFields = require('encrypt-object-fields')

const object = {
    field: {
        subfield: 'this is my subfield'
    },
    otherfield: 'this is my other field'
}

async function showObject() {
    const encryptedObjectFields = await encryptObjectFields(object, ['field.subfield', 'otherfield']);

    console.log(encryptedObjectFields);
}

showObject();
// -- result
// object: {
//     field: {
//         subfield: '65675324234kfghtnyuascfd'
//     }
//     otherfield: '345123097778amdsjnctsjdns'
// }
```

