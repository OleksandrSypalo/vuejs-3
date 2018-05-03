/* globals localStorage */
const DB_PREFIX = '__db__';

export default {
    opers: ['get', 'set', 'drop'],
    uniq() {
        return Date.now() + '' + Math.ceil(Math.random() * 1e4);
    },
    getLastID(dbName) {
        const data = this.get(dbName);
        let maxID = 0;

        for (let key in data) {
            maxID = Math.max(maxID, +data[key].id);
        }
        maxID = Math.max(maxID, Object.keys(data).length);

        return maxID;
    },

    triggersData: {},
    setTrigger(oper, dbName, cb) {
        const opers = (oper === '*')
            ? this.opers
            : (oper instanceof Array)
            ? oper
            : [oper];

        opers.forEach((currentOper) => {
            this.triggersData[currentOper + '.' + dbName] = (this.triggersData[currentOper + '.' + dbName] || []);
            this.triggersData[currentOper + '.' + dbName].push(cb);
        });
    },
    getTrigger(oper, dbName) {
        if (this.triggersData[oper + '.' + dbName] instanceof Array) {
            this.triggersData[oper + '.' + dbName].forEach((fn) => {
                fn();
            });
        }
    },

    pingToDb(dbName) {
        return JSON.parse(localStorage[DB_PREFIX + dbName] || '{}');
    },
    getID(dbName, req) {
        let data = this.pingToDb(dbName);
        let resultSearch = false;

        if (req instanceof Object) {
            for (let keyInDB in data) {

                for (let keySearch in req) {
                    if (data[keyInDB][keySearch] !== req[keySearch]) {
                        resultSearch = false;
                        break;
                    } else {
                        resultSearch = keyInDB;
                    }
                }

                if (resultSearch) {
                    break;
                }
            }
        }

        return resultSearch || null;
    },
    get(dbName, key) {
        let data = this.pingToDb(dbName);

        if (key instanceof Object) {
            for (let keyInDB in data) {
                let resultSearch = false;

                for (let keySearch in key) {
                    if (data[keyInDB][keySearch] !== key[keySearch]) {
                        resultSearch = false;
                        break;
                    } else {
                        resultSearch = true;
                    }
                }

                if (resultSearch) {
                    return this.get(dbName, keyInDB);
                }
            }
        } else {
            this.getTrigger('get', dbName);

            return key ? (data[key] || {}) : data;
        }
    },
    set(dbName, dataSet, replaceAll) {
        let data;

        if (replaceAll) {
            localStorage[DB_PREFIX + dbName] = JSON.stringify(dataSet);
        } else {
            data = this.pingToDb(dbName);
            localStorage[DB_PREFIX + dbName] = JSON.stringify(Object.assign(data, dataSet));
            this.getTrigger('set', dbName);
        }

        return dataSet;
    },
    drop(dbName, key) {
        let data;

        if (!key) {
            localStorage.removeItem(DB_PREFIX + dbName);
        } else {
            data = this.pingToDb(dbName);

            if (key instanceof Object) {
                for (let keyInDB in data) {
                    let resultSearch = false;

                    for (let keySearch in key) {
                        if (data[keyInDB][keySearch] !== key[keySearch]) {
                            resultSearch = false;
                            break;
                        } else {
                            resultSearch = true;
                        }
                    }

                    if (resultSearch) {
                        this.drop(dbName, keyInDB);
                    }
                }
            } else {
                delete data[key];
                this.set(dbName, data, true);
                this.getTrigger('drop', dbName);
            }
        }
    },
    use(constructor) {
        return Object.assign(this, constructor);
    },
};
