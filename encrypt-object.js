const crypto = require('crypto');
const _ = require('lodash');

async function encryptObject(obj, fields) {
    for (const field of fields) {
        if (!field || field === "") continue;

        const fieldExists = _.get(obj, field);

        if (!fieldExists) continue;

        eval(
            `var fn = async function() {
                try {
                    const criptoParams = {
                        "algoritm": "aes256",
                        "secret": "encryptobjectfields",
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

        await fn();
    }

    return obj;
};

module.exports = async (obj, fields) => {
    const decryptedobject = JSON.parse(JSON.stringify(obj));

    const encryptedobject = await encryptObject(decryptedobject, fields);

    return encryptedobject;
}