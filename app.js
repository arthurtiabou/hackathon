
path = require("path")

var express = require('express'),
        app = express(),
        pdf = require('express-pdf');
 
//previously app.use(pdf())
app.use(pdf); // or you can app.use(require('express-pdf'));
 

 
app.use('/pdfFromHTMLString', function(req, res){
    res.pdfFromHTML({
        filename: 'generated.pdf',
        htmlContent: '<html><body>Desole cette fonctionnalite est en cour de développement !</body></html>',
        
    });
});
 

