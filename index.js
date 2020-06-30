// Requiring LTIJS provider
const Lti = require('ltijs').Provider
// Requiring path
const path = require('path')
// Loading environment variables
require('dotenv').config()

// Creating a provider instance
const lti = new Lti(process.env.LTI_KEY,
    // Setting up database configurations
    { url: 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_DATABASE,
      connection: { user: process.env.DB_USER, pass: process.env.DB_PASS } })

// Main route
lti.app.get('/main', async (req, res) => {
    return res.send('Hello World!')
    })

async function setup () {
// Deploying provider, connecting to the database and starting express server.
await lti.deploy()
// Register Moodle as a platform
    const plat = await lti.registerPlatform({
        url: 'http://localhost',
        name: 'Local Moodle',
        clientId: 'uDSnxHqNvEsLfY0',
        authenticationEndpoint:'http://localhost/mod/lti/auth.php',
        accesstokenEndpoint:'http://localhost/mod/lti/token.php',
        authConfig: { 
        method: 'JWK_SET', 
        key: 'http://localhost/mod/lti/certs.php' }
    })
// Get the public key generated for that platform
console.log(await plat.platformPublicKey())
lti.onConnect((connection, request, response) => {
    lti.redirect(response, '/main', { ignoreRoot: true, isNewResource: true })
}, { secure: false })
console.log('Deployed!')
}

setup()