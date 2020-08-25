const crypto = require('crypto');

async function getEncryptedObject(obj, arrayOfFields) {
    for (const field of arrayOfFields) {
        const props = field.split(".");

        let finalProp = "obj";

        for (const prop of props) {
            if (prop.includes('[') && prop.includes(']')) {
                const splitPositionArray = prop.split("[");

                for (let i = 0; i < splitPositionArray.length; i++) {
                    if (i === 0) {
                        finalProp = finalProp.concat(`['${splitPositionArray[0]}']`);
                    } else {
                        finalProp = finalProp.concat(`['${splitPositionArray[i].replace("]", "")}']`);
                    }
                }
            } 
            else {
                finalProp = finalProp.concat(`['${prop}']`);
            }
        }

        eval(
            `var fn = async function() {
                try {
                    const criptoParams = {
                        "algoritm": "aes256",
                        "secret": "encryptobjectfields",
                    };

                    const cipher = await crypto.createCipher(criptoParams.algoritm ,criptoParams.secret);

                    let encrypted = cipher.update(${finalProp}, 'utf8', 'hex');

                    encrypted += cipher.final('hex');

                    ${finalProp} = encrypted;
                }
                catch (err) {
                    throw new Error(err.message || err);
                }
            }`
        );

        await fn();
    }

    return obj;
};

module.exports = async (obj, arrayOfFields) => {
    let encryptobject = JSON.parse(JSON.stringify(obj));

    encryptobject = await getEncryptedObject(encryptobject, arrayOfFields);

    return encryptobject;
}