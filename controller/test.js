module.exports = function(app) {
    app.get(['/test'],function(req,res) {
        res.clearCookie('oid');
        res.render('pages/test.html',{layout: null});
    });
};
