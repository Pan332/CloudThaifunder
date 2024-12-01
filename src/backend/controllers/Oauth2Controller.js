import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import connection from '../db.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { jwtGenerate,jwtRefreshTokenGenerate } from "./authControllers.js";

dotenv.config({ path: '../.env' });
const port = process.env.PORT;

const queryDatabase = (query, params) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
};

export const GoogleAuth = async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://23.22.78.84:5173');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirecturl = `http://23.22.78.84:${port}/Oauth2/google/callback/`;

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirecturl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ["profile", "email"],
        prompt: 'consent',
    });

    res.json({ url: authorizeUrl });
};

export const GoogleCallback = async function (req, res, next) {
    const code = req.query.code;
    try {
        const redirecturl = `http://23.22.78.84:${port}/Oauth2/google/callback/`;
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirecturl
        );
        const { tokens } = await oAuth2Client.getToken(code);
        const id_token = tokens.id_token;

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, given_name, family_name } = ticket.getPayload();

        // Query the database to check if the user already exists
        const [users] = await queryDatabase('SELECT * FROM users WHERE email = ?', [email]);

        if (users){
            // User exists, send JWT tokens
            const user = users;
            const accessToken = jwtGenerate(user);
            const refreshToken = jwtRefreshTokenGenerate(user);
            res.redirect(`http://23.22.78.84:5173?token1=${accessToken}&token2=${refreshToken}`);
        } else {
            // Check if the username already exists
            let newUsername = name;
            const [existingUser] = await queryDatabase('SELECT * FROM users WHERE username = ?', [newUsername]);

            if (existingUser && existingUser.length > 0) {
                // Username already exists, modify the username (append a number or generate a new one)
                newUsername = `${name}_${Math.floor(Math.random() * 1000)}`;
                // Check if the new username is also taken, retry if necessary
                const [checkUser] = await queryDatabase('SELECT * FROM users WHERE username = ?', [newUsername]);
                if (checkUser && checkUser.length > 0) {
                    newUsername = `${name}_${Math.floor(Math.random() * 10000)}`; // Try appending a larger number
                }
            }

            // Generate a random password for the new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

            // Insert the new user into the database with the generated hashed password
            const insertResult = await queryDatabase(
                'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
                [newUsername, email, hashedPassword, given_name, family_name]
            );

            // Create JWT tokens for the new user
            const newUser = {
                user_id: insertResult.insertId, // Use the DB user_id
                username: newUsername,
                email,
            };
            const accessToken = jwtGenerate(newUser);
            const refreshToken = jwtRefreshTokenGenerate(newUser);

            res.redirect(`http://23.22.78.84:5173?token1=${accessToken}&token2=${refreshToken}`);
        }
    } catch (err) {
        console.error('Error signing in with Google:', err);
        res.status(500).json({ message: 'An error occurred during authentication' });
    }
};