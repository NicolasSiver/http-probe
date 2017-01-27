const fs = require('fs');

const files = {
    Playstation: 'test/snapshot/store-playstation-com.snapshot',
    Amazon     : 'test/snapshot/www-amazon-com.snapshot',
    Polymer    : 'test/snapshot/www-polymer-project-org.snapshot'
};

for (let key in files) {
    global['snapshot' + key] = JSON.parse(fs.readFileSync(files[key], {encoding: 'utf8'}));
}
