var page = require('webpage').create();

// Overriding to browser agent
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';

page.addCookie({
    "domain": ".hearthpwn.com",
    "expires": "Thu, 26 Feb 2026 02:20:48 GMT",
    "expiry": 1772072448,
    "httponly": true,
    "name": "Auth.NetworkSession",
    "path": "/",
    "secure": false,
    "value": "P5EOBB5U6MJCC0SESF33JVP09QYWZKIWRKFAR2K7YUL3J26F"
});

page.open('http://www.hearthpwn.com', function(status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        // var user = page.evaluate(function() {
        //     return document.getElementsByClassName('netbar-user');
        // });
        //
        // console.log(JSON.stringify(user, null, 4));

        for (var i in page.cookies) {
            console.log(JSON.stringify(page.cookies[i], null, 4));
        }
    }

    phantom.exit();
});
