const { isEmpty } = require('lodash');
const { createCipher } = require('crypto');

async function getEncryptedObject(payload, fields) {
    if (typeof payload !== 'object' || isEmpty(payload)) return payload;

    for (const field of fields) {
        if (!isEmpty(field)) {
            if (typeof field === "object") {
                const key = Object.keys(field)[0];

                eval(
                    `var encrypt = async function() {
                        try {
                            for (const element of payload.${key}) {
                                const values = Object.keys(element);

                                for (const value of values) {
                                    if (Object.values(field)[0].includes(value) && !isEmpty(element[value])) {
                                        const criptoParams = {
                                            algoritm: "aes256",
                                            secret: "encryptobjectfields",
                                        };

                                        const cipher = await createCipher(criptoParams.algoritm, criptoParams.secret);

                                        const encrypted = cipher.update(element[value].toString(), 'utf8', 'hex') + cipher.final('hex');

                                        element[value] = encrypted;
                                    }
                                }
                            }
                        }
                        catch (err) {
                            throw new Error(err.stack || err);
                        }
                    }`
                );

                await encrypt();
            }
            else {
                eval(
                    `var encrypt = async function() {
                        if (!isEmpty(payload.${field})) {
                            try {
                                const criptoParams = {
                                    algoritm: "aes256",
                                    secret: "encryptobjectfields",
                                };
            
                                const cipher = await createCipher(criptoParams.algoritm, criptoParams.secret);
            
                                const encrypted = cipher.update(payload.${field}.toString(), 'utf8', 'hex') + cipher.final('hex');
            
                                payload.${field} = encrypted;
                            }
                            catch (err) {
                                throw new Error(err.stack || err);
                            }
                        }
                    }`
                );

                await encrypt();
            }
        };
    }

    return payload;
};

module.exports = async (payload, fields) => getEncryptedObject(JSON.parse(JSON.stringify(payload)), fields);