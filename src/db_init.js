


exports.init = function (db) {
    var init_data = {
        username: 'admin',
        password: 'qwe'
    };
    var admin_collection = db.collection('admin');
    admin_collection.findOne(init_data, function (err, res) {
        if (res === null) admin_collection.insertOne(init_data);
    })
}
