var page = require('webpage').create();

console.log('Overriding default user agent of: ' + page.settings.userAgent);
// Overriding to browser agent
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';

page.open('http://www.httpuseragent.org', function(status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = page.evaluate(function() {
            return document.getElementById('myagent').textContent;
        });

        console.log(ua);
    }

    phantom.exit();
});
