const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const sqlite3 = require('sqlite3')
const jwt = require("jsonwebtoken");
const db = new sqlite3.Database('./database.db')

app.use(express.json());
require("dotenv-safe").config({ example: "./.env" });

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL , password TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY AUTOINCREMENT, taskname TEXT NOT NULL, userID INTEGER, username TEXT NOT NULL, done TEXT NOT NULL)')
})

app.use(cors({
    origin: 'http://localhost:5173',
}))



app.post('/login', (req, res) => {
    const { name, password } = req.body;

    if (!name) {
        err = JSON.stringify({ err: 'name is required' })
        return res.status(400).send(err)
    }
    if (!password) {
        err = JSON.stringify({ err: 'password is required' })
        return res.status(400).send(err)
    };

    db.get("SELECT * FROM users WHERE name = ? AND password = ?", [
        name,
        password,
    ], (err, row) => {
        if (err) {
            err = JSON.stringify({ err: "Error logging in" })
            res.status(500).send(err);
        } else if (row) {
            const token = jwt.sign(
                { userId: row.id, username: row.name },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1h" },
            );
            message = JSON.stringify({ message: "Login successful", token: token })
            res.status(200).send(message)
        } else {
            // poderia fazer redirect para a página de login
            err = JSON.stringify({ err: "Invalid username or password" })
            res.status(401).send(err);
        }
    });

});
app.post('/register', (req, res) => {
    // cria um novo usuário
    const { name, password } = req.body
    if (!name) {
        err = JSON.stringify({ err: 'name is required' })
        return res.status(400).send(err)
    }
    if (!password) {
        err = JSON.stringify({ err: 'password is required' })
        return res.status(400).send(err)
    }

    db.run(
        "INSERT INTO users (name, password) VALUES (?, ?)",
        [name, password],
        function (err) {
            if (err) {
                console.error(err);
                if (err.errno === 19) {
                    err = JSON.stringify({ err: 'User already exists' })
                    res.status(409).send(err);
                } else {
                    err = JSON.stringify({ err: 'Error registering user' })
                    res.status(500).send(err);
                }
            } else {
                // poderia fazer redirect para a página de login
                message = JSON.stringify({ message: "User registered successfully" })
                res.status(201).send(message);
            }
        },
    );
}
);



app.put('/register', (req, res) => {
    // muda a senha do perfil
    const { name, password, newPassword } = req.query
    const userProfile = getUserById(id)

    if (!userProfile) {
        err = JSON.stringify({ err: 'Profile not found' })
        return res.status(404).send(err)
    }

    if (!name && !password && !newPassword) {
        err = JSON.stringify({ err: 'Name or age is required' })
        return res.status(400).send(err)
    }
    db.run("UPDATE users set password = ? WHERE id = ?", [
        password,
        id,
    ], (err) => {
        if (err) {
            err = JSON.stringify({ err: "Error updating user" })
            res.status(500).send(err);
        } else {
            // poderia fazer redirect para a página de login
            message = JSON.stringify({ message: "User updated successfully" })
            res.status(200).send(message);
        }
    });

})
app.get('/tasks', (req, res) => {
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

    db.all("SELECT * FROM tasks WHERE userID = ?", [id], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting tasks");
        } else {
            res.json(rows);
        }
    });
})
app.post('/tasks', (req, res) => {
    // cria uma nova task
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

    const { taskname, done } = req.body

    if (!taskname) {
        err = JSON.stringify({ err: 'Task name is required' })
        return res.status(400).send(err)
    }
    if (!done) {
        err = JSON.stringify({ err: 'Done is required' })
        return res.status(400).send(err)
    }

    const userID = decoded.userId;
    const username = decoded.username;

    db.run(`INSERT INTO tasks (taskname, userID, username, done) VALUES (?,?,?,?)`, [taskname, userID, username, done], function (err) {
        if (err) {
            err = JSON.stringify({ err: "Error creating task" })
            res.status(500).send(err)
        } else {
            message = JSON.stringify({ message: "Task registered successfully" })
            res.status(201).send(message);
        }
    })
    db.run("SELECT * FROM tasks ORDER BY taskId DESC limit 1", (err, row) => {
        res.send(row);
    })

});

app.put('/tasks', (req, res) => {
    const { name, userID, username, done } = req.body

    if (!name) {
        err = JSON.stringify({ err: 'Name is required' })
        return res.status(400).send(err)
    }
    if (!userID) {
        err = JSON.stringify({ err: 'UserID is required' })
        return res.status(400).send(err)
    }
    if (!username) {
        err = JSON.stringify({ err: 'Username is required' })
        return res.status(400).send(err)
    }
    if (!done) {
        err = JSON.stringify({ err: 'Done is required' })
        return res.status(400).send(err)
    }

    db.run("UPDATE tasks set (name = ?, UserId = ?, Username = ?, done = ? )", [name, userID, username, done], (err) => {
        if (err) {
            err = JSON.stringify({ err: "Tasks updating user" })
            res.status(500).send(err);
        } else {
            // poderia fazer redirect para a página de login
            message = JSON.stringify({ message: "Tasks updated successfully" })
            res.status(200).send(message);
        }
    })
})


// diponibilita o acesso da aplicação na porta desejada
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})