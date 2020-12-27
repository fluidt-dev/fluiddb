const logger = require('@fluidt/logger');

const storage = {}

const methods = {
    exists:(key) => {
        return !!storage[key]
    },
    get:(key) => {
        return storage[key]
    },
    create:(key,obj) =>{
        storage[key] = obj
        return storage[key]
    },
    delete:(key) =>{
        try {
            delete storage[key];
            return true;
        } catch(e){
            logger.error(`There was problem deleting ${key}`);
            return false;
        }
    },
    replace:(key,obj) =>{
        storage[key] = obj
        return storage[key]
    },
    update:(key,obj) => {
        let updated = Object.assign(storage[key], obj);
        storage[key] = updated;
        return updated; 
    }
}

module.exports = methods