// ******NOT IN USE******
// This approach directly access the MELD Sandbox API from the server side, 
// our current approach is EHR launch from the client side and then access the MELD Sandbox API from the client side.
const express = require('express');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Constants from .env
const { SANDBOX_BASE_URL, SCOPE, CLIENT_ID, REDIRECT_URI } = process.env;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Initiate OAuth Flow: Redirect to MELD Sandbox authorization page
app.get('/launch', (req, res) => {
    const authUrl = `${SANDBOX_BASE_URL}?` +
        `response_type=code&` +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `scope=${SCOPE}`;

    res.redirect(authUrl);
});

// Handle Redirect from Authorization Server
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Format the request data as URL-encoded form data
        const response = await axios.post(`${SANDBOX_BASE_URL}/token`, 
            qs.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // Process the access token (e.g., save it in session, database, etc.)
        const { access_token } = response.data;
        console.log('Access Token:', access_token);

        // Redirect to the main application or a success page
        res.redirect('/'); // Adjust as needed
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Handle all other routes by serving index.html from dist
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
