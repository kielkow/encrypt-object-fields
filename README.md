# Package util for encrypt specific fields from your object

How to use?

installing:
```shell
npm i encrypt-object-fields
```

coding:
```js
const { encryptObject } = require('encrypt-object-fields');
 
const object = {
    first_field: "This is a normal field",
    second_field: {
        "subfield": "This is a subfield"
    },
    array_of_fields: [
        {
            object_array: "lorem ipsum",
            hadoop: "New..wake up"
        },
        [
            {
                property: "matrix",
                enconding: "234324234"
            }
        ]
    ]
}
 
async function showObject() {
    const encryptedObjectFields = await encryptObject(
        object, 
        [
            "first_field", 
            "subfield", 
            "object_array",
            "enconding"
        ]
    );
 
    console.log(encryptedObjectFields);
}

showObject();

// RESULT
// {
//     "first_field":"04cdf2b50fe363dcb49ee2a5345c6371a22a3d96f3450ca63f5317d3e1fd94b4",
//     "second_field":{
//        "subfield":"f6569370c1f251bc8c1dfaca8457f77b447d1a23ba14b7ffc5b4153031a0f09c"
//     },
//     "array_of_fields":[
//        {
//           "object_array":"106e3001626eea1895da826410d9b9ee",
//           "hadoop":"New..wake up"
//        },
//        [
//           {
//              "property":"matrix",
//              "enconding":"922e6a0215259c76c602569dfefa7a1d"
//           }
//        ]
//     ]
// }
```

