const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET_KEY;

// Sign up
router.post("/signup", function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed",
        });
        return;
    }

    // Query database for the given user
    const queryUsers = req.db
        .from("users")
        .select("*")
        .where("email", "=", email);

    queryUsers
        .then((users) => {
            if (users.length > 0) {
                return res.status(409).json({
                    error: true,
                    message: "User already exists",
                });
            }
            // Insert users into db with encrypted password
            const saltRounds = 10;
            const hash = bcrypt.hashSync(password, saltRounds);
            return req.db.from("users").insert({ email, hash });
        })
        .then(() => {
            // Retrieve the newly created user's ID
            return req.db
                .from("users")
                .select("id")
                .where("email", "=", email)
                .first();
        })
        // Create and respond with new JWT token
        .then((user) => {
            const expires_in = 60 * 60 * 24; // 1 day
            const exp = Date.now() + expires_in * 1000;
            const token = jwt.sign({ email, id: user.id, exp }, JWT_SECRET);
            res.status(201).json({ success: true, message: "user created", token_type: "Bearer", token, expires_in });
        });
});

// login
router.post("/login", function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed",
        });
    }

    const queryUsers = req.db
        .from("users")
        .select("*")
        .where("email", "=", email);

    queryUsers
        .then((users) => {
            if (users.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: "User does not exist",
                });
            }

            // compare encrypted passwords
            const user = users[0];
            return bcrypt.compare(password, user.hash).then((match) => {
                if (!match) {
                    return res.status(401).json({
                        error: true,
                        message: "Invalid email or password",
                    });
                }

                // create and respond with JWT token
                const expires_in = 60 * 60 * 24; // 1 day
                const exp = Date.now() + expires_in * 1000;
                const token = jwt.sign({ email, id: user.id, exp }, JWT_SECRET);
                res.json({ token_type: "Bearer", token, expires_in });
            });
        })
        .catch((error) => {
            console.error("Error during login:", error);
            res.status(500).json({
                error: true,
                message: "Internal server error",
            });
        });
});

module.exports = router;