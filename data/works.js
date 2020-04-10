const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
 
const url = process.env.DB_URL;

const dbName = 'fave_art';
const colName = 'art';

const settings = { useUnifiedTopology: true };

const invalidWork = (work) => {
    let result;
    if (!work.title) {
        result = 'Work Requires a Title';
    } else if (!work.artist) {
        result = 'Work Requires an Artist';
    } else if (!work.medium) {
        result = 'Work Requires a Medium';
    } else if (!work.location) {
        result = 'Work Requires a Location'
    };
    return result;
};

const getWorks = () => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server to GET Works");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function(err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Found the following records");
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    };
                });
            };
        });
    });
    return iou;
};

const addWork = (works) => {
    // const invalidArticles =
    const iou = new Promise((resolve, reject) => {
        if (!Array.isArray(works)) {
            reject({ error: 'Need to send an Array of Works' });
        } else {
            const invalidWorks = works.filter((work) => {
                const check = invalidWork(work);
                if (check) {
                    work.invalid = check;
                }
                return work.invalid;
            });
            if (invalidWorks.length > 0) {
                reject({
                    error: "Some works were invalid.",
                    data: invalidWorks
                });
            } else {
                MongoClient.connect(url, settings, async function(err, client) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Connected successfully to server to POST Works");
                        const db = client.db(dbName);
                        const collection = db.collection(colName);
                        works.forEach((work) => { 
                            work.dateAdded = new Date(Date.now()).toUTCString(); 
                        });
                        const results = await collection.insertMany(works);
                        resolve(results.ops);
                    };
                });
            };
        };
    });
    return iou;
};

const updateWork = (id, work) => {
    const iou = new Promise((resolve, reject) => {
        // if (work.link) {
        //     if (!validURL(article.link)) {
        //         article.invalid = "Link not valid URL";
        //         reject(article);
        //     };
        // };
        MongoClient.connect(url, settings, function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connect successfully to server to PATCH an Work");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try {
                    const _id = new ObjectID(id);
                    collection.updateOne( { _id},
                        { $set: { ...article } },
                        function(err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                if (data.result.n > 0) {
                                    collection.find({ _id }).toArray(
                                        function(err, docs) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(docs[0]);
                                            };
                                        }
                                    );
                                } else {
                                    resolve({ error: "Nothing Updated" })
                                };
                            };
                        });
                } catch (err) {
                    console.log(err);
                    reject({ error: "ID has to be in ObjectID format" });
                };
            };
        });
    });
    return iou;
};

const deleteWork = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server to DELETE an Work");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try {
                    const _id = new ObjectID(id);
                    collection.findOneAndDelete({ _id }, function(err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            if(data.lastErrorObject.n > 0) {
                                resolve(data.value);
                            } else {
                                resolve({ error: "ID doesn't exist" });
                            }
                        };
                    });
                } catch {
                    console.log(data);
                    reject({ error: "ID has to be in ObjectID format" });
                };
            };
        });
    });
    return iou;
};

module.exports = {
    getWorks,
    addWork,
    updateWork,
    deleteWork
};