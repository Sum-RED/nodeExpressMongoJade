const { MongoClient, ObjectId } = require("mongodb");

function myDB() {
  const myDB = {};
  const dbName = "musicCollection";
  const colName = "song";
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

  myDB.getSongs = async function (page) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);
      const query = {};

      return await col
        .find(query)
        // sort in descending order by creation
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
    } finally {
      client.close();
    }
  };

  myDB.createSong = async function (song) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.insertOne(song);
    } finally {
      client.close();
    }
  };

  myDB.updateSong = async function (song) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.updateOne(
        { _id: ObjectId(song._id) },
        {
          $set: {
            Name: song.Name,
            Milliseconds: +song.Milliseconds,
          },
        }
      );
    } finally {
      client.close();
    }
  };

  myDB.deleteSong = async function (song) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.deleteOne({ _id: ObjectId(song._id) });
    } finally {
      client.close();
    }
  };

  return myDB;
}

module.exports = myDB();
