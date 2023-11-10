module.exports = function(app){
    app.get('/', function(req, res){
        console.log("/");
        res.json("{}");
    });
}