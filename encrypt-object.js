const crypto = require('crypto');
const _ = require('lodash');

async function getEncryptedObject(obj, fields, arrays) {
    for (const field of fields) {
        if (!field || field === "") continue;

        const fieldExists = _.get(obj, field);

        if (!fieldExists) continue;

        eval(
            `var fnFields = async function() {
                try {
                    const criptoParams = {
                        algoritm: "aes256",
                        secret: "encryptobjectfields",
                    };

                    const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);

                    let encrypted = cipher.update(obj.${field}, 'utf8', 'hex');

                    encrypted += cipher.final('hex');

                    obj.${field} = encrypted;
                }
                catch (err) {
                    throw new Error(err.message || err);
                }
            }`
        );

        await fnFields();
    }

    if (arrays) {
        for (const array of arrays) {
            const key = Object.keys(array)[0];
            const props = Object.values(array)[0];

            eval(
                `var fnArrays = async function() {
                    try {
                        for (const element of obj.${key}) {
                            const values = Object.keys(element);

                            for (const value of values) {
                                if (props.includes(value)) {
                                    const criptoParams = {
                                        algoritm: "aes256",
                                        secret: "encryptobjectfields",
                                    };

                                    const cipher = await crypto.createCipher(criptoParams.algoritm, criptoParams.secret);

                                    let encrypted = cipher.update(element[value], 'utf8', 'hex');

                                    encrypted += cipher.final('hex');

                                    element[value] = encrypted;
                                }
                            }
                        }
                    }
                    catch (err) {
                        throw new Error(err.message || err);
                    }
                }`
            );

            await fnArrays();
        }
    }

    return obj;
};

module.exports = async (obj, fields, arrays) => {
    let encryptobject = JSON.parse(JSON.stringify(obj));

    encryptobject = await getEncryptedObject(encryptobject, fields, arrays);

    return encryptobject;
}