const crypto = require('crypto');
const _ = require('lodash');

async function decryptObject(obj, fields, arrays) {
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

                    const decipher = await crypto.createDecipher(criptoParams.algoritm, criptoParams.secret);

                    let decrypted = decipher.update(obj.${field}, 'hex', 'utf8');

                    decrypted += decipher.final('utf8');

                    obj.${field} = decrypted;
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

                                    const decipher = await crypto.createDecipher(criptoParams.algoritm, criptoParams.secret);

                                    let decrypted = decipher.update(element[value], 'hex', 'utf8');
                
                                    decrypted += decipher.final('utf8');

                                    element[value] = decrypted;
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
    const encryptedobject = JSON.parse(JSON.stringify(obj));

    const decryptedobject = await decryptObject(encryptedobject, fields, arrays);

    return decryptedobject;
}