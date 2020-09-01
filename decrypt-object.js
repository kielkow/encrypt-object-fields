const crypto = require('crypto');
const _ = require('lodash');

async function decryptObject(obj, fields) {
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

                    const decipher = await crypto.createDecipher(criptoParams.algoritm ,criptoParams.secret);

                    let decrypted = decipher.update(obj.${field}, 'hex', 'utf8');

                    decrypted += decipher.final('utf8');

                    obj.${field} = decrypted;
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
    const encryptedobject = JSON.parse(JSON.stringify(obj));

    const decryptedobject = await decryptObject(encryptedobject, fields);

    return decryptedobject;
}