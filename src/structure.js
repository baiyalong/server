
exports.route = function (app, db) {


    app.get('/project/:project/service/:service/version/:version',
        function (req, res) {
            // db.collection('structure').findOne({
            //     // project
            // }).configuration
            res.send(req.params);
        });


    app.get('/structure',
        function (ereq, res) {
            structure_collection.find({}).toArray(function (err, arr) {
                res.send(err ? { error: err.message } : { structure: arr })
            })
        })


    app.post('/project',
        function (req, res) {
            var project = {
                code: req.body.code || '',
                name: req.body.name || '',
                username: req.body.username || '',
                password: req.body.username || '',
            }
            if (!project.code) res.send({ error: '项目编码不能为空！' })
            else structure_collection.findOne({ code: project.code }, function (err, doc) {
                if (err) res.send({ error: err.message });
                else if (doc) res.send({ error: '项目编码不能重复！' });
                else structure.insertOne(project, function (err) {
                    if (err) res.send({ error: err.message });
                    else res.end()
                })
            })
        })

        
    app.post('/project/:project/')
}