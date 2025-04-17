const express = require("express");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken");

// config dotenv
require("dotenv-safe").config({ example: "./.env" });

// config express
const app = express();
const port = 3000;

// config sqlite
const db = new sqlite3.Database("./database.sqlite");

db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, password TEXT NOT NULL)",
);
db.run(
    "CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, userID INTEGER, username TEXT NOT NULL, done TEXT NOT NULL)",
);

// config middleware
app.use(express.json());

// route GET /
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// route POST /register
// insert user
// status 201 if success
// status 409 if user already exists
// status 500 if error
app.post("/register", (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const password = req.body.password;

    db.run(
        "INSERT INTO users (name, password) VALUES (?, ?)",
        [name, password],
        function (err) {
            if (err) {
                console.error(err);
                if (err.errno === 19) {
                    res.status(409).send("User already exists");
                } else {
                    res.status(500).send("Error registering user");
                }
            } else {
                res.status(201).send("User registered successfully");
            }
        },
    );
});

// route POST /login
// send json with token
// status 200 if success
// status 401 if invalid username or password
// status 500 if error
app.post("/login", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    db.get("SELECT * FROM users WHERE name = ? AND password = ?", [
        name,
        password,
    ], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error logging in");
        } else if (row) {
            // generate jwt token and set cookie
            const token = jwt.sign(
                { userId: row.id, username: row.name },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1h" },
            );
            // console.log({ token: token });
            res.status(200).send(JSON.stringify({ token: token })).header("Set-Cookie", `token=${token}`);
        } else {
            // poderia fazer redirect para a página de login
            res.status(401).send("Invalid username or password");
        }
    });
});

// protected route GET /logout
// log out
// read token from authorization header
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.get("/logout", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";
    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        // console.log(decoded);
        // marcar no banco de dados token expirado
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    res.status(200).send("Logged out successfully");
});

// protected route PUT /user
// update user password
// read jwt token from authorization header
// check if user is the same from id
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.put("/user", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        // console.log(decoded);
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    const id = decoded.userId;
    const name = req.body.name;
    const password = req.body.password;

    db.run("UPDATE users set password = ? WHERE id = ?", [
        password,
        id,
    ], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating user");
        } else {
            // poderia fazer redirect para a página de login
            res.status(200).send("User updated successfully");
        }
    });
});

// protected route DELETE /user/:id
// delete user
// only user admin can do that
// read jwt token from authorization header
// check if user is admin
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.delete("/user/:id", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";
    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        // console.log(decoded);
        //check if user is admin
        if (decoded.username !== "admin") {
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    const id = req.params.id;

    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting user");
        } else {
            // poderia fazer redirect para a página de login
            res.status(200).send("User deleted successfully");
        }
    });
});

// protected route GET /tasks/
// get all tasks
// read jwt token from authorization header
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.get("/tasks/", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        console.log(decoded);
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    const id = decoded.userId;

    db.all("SELECT * FROM tasks WHERE userID = ?", [id], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting tasks");
        } else {
            res.json(rows);
        }
    });
});

// protected rout POST /task
// save a task
// read jwt token from authorization header
// status 201 if success
// status 401 if unauthorized
// status 500 if error
app.post("/task/", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        console.log(decoded);
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    const id = decoded.userId;
    const username = decoded.username;
    const taskname = body.taskname;
    const done = body.done;

    db.run("INSERT INTO tasks (userid, username, name, done) values(?,?,?,?)", [
        id,
        username,
        taskname,
        done,
    ], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error setting tasks");
        } else {
            res.status(201).send("Created task.");
        }
    });
});

// protected rout PUT /task/:d
// update a task
// read jwt token from authorization header
// only update a task if tasks`userid id equal to authorized userId
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.put("/task/:id", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        console.log(decoded);
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    id = req.params("id");
    userid = decoded.userId;
    db.get("SELECT * FROM task WHERE id = ? AND userid = ?", [
        id,
        userId,
    ], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating task");
        } else if (row) {
            taskname = req.body.taskname;
            done = req.body.done;

            db.run("UPDATE TABLE tasks set (name=?, done=?) where id = ?", [
                taskname,
                done,
                id,
            ], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error setting tasks");
                } else {
                    res.status(200).send("Updated task.");
                }
            });
        } else {
            // poderia fazer redirect para a página de login
            res.status(404).send("Task not found");
        }
    });
});

// protected route DELETE /task/:d
// delete a task
// read jwt token from authorization header
// only delete a task if tasks`userid id equal to authorized userId
// status 200 if success
// status 401 if unauthorized
// status 500 if error
app.delete("/task/:id", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        console.log(decoded);
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    id = req.params("id");
    userid = decoded.userId;
    db.get("SELECT * FROM task WHERE id = ? AND userid = ?", [
        id,
        userId,
    ], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating task");
        } else if (row) {
            db.run("DELETE FROM TABLE task where id = ?", [id], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error deleting tasks");
                } else {
                    res.status(200).send("Task deleted.");
                }
            });
        } else {
            // poderia fazer redirect para a página de login
            res.status(404).send("Task not found");
        }
    });
});

// start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
