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
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, password TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS tasks (taskID INTEGER PRIMARY KEY AUTOINCREMENT, taskname TEXT NOT NULL, description TEXT NOT NULL, userID INTEGER, username TEXT NOT NULL, done TEXT NOT NULL)')
})

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://172.18.0.')
            || origin.startsWith('http://127.0.0.1')
            || origin.startsWith('http://localhost')    
            || origin.startsWith('http://taskflow')
    ) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    // origin: ['http://localhost:5173', 'http://taskflow:5173'],
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
                { userID: row.id, username: row.name },
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
    const { name, password,  } = req.body
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

    const id = decoded.userID;

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
        err = JSON.stringify({ err: "Unauthorized" })
        return res.status(401).send(err);
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
        err = JSON.stringify({ err: "Unauthorized" })
        return res.status(401).send(err);
    }
    // end check

    const { taskname, description, done } = req.body

    if (!taskname) {
        err = JSON.stringify({ err: 'Task name is required' })
        return res.status(400).send(err)
    }
    if (!done) {
        err = JSON.stringify({ err: 'Done is required' })
        return res.status(400).send(err)
    }

    const userID = decoded.userID;
    const username = decoded.username;
    db.run(`INSERT INTO tasks (taskname, userID, username, done, description) VALUES (?,?,?,?,?)`, [taskname, userID, username, done, description], function (err) {
        if (err) {
            err = JSON.stringify({ err: "Error creating task" })
            res.status(500).send(err)
        } else {
            message = JSON.stringify({ message: "Task registered successfully" })
            res.status(201).send(message);
        }
    })
    db.run("SELECT * FROM tasks ORDER BY taskID DESC limit 1", (err, row) => {
        res.send(row);
    })

});

app.put('/tasks', (req, res) => {
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        err = JSON.stringify({ err: "Unauthorized" })
        return res.status(401).send(err);
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
        err = JSON.stringify({ err: "Unauthorized" })
        return res.status(401).send(err);
    }
    // end check

    const userID = decoded.userID;
    const username = decoded.username;
    const {taskID, taskname, done} = req.body

    if (!taskname) {
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

    db.run("UPDATE tasks SET taskname=?, userID=?, username=?, done=? WHERE taskID = ?", [taskname, userID, username, done, taskID], (err) => {
        if (err) {
            console.error(err);
            err = JSON.stringify({ err: "Tasks updating user" })
            res.status(500).send(err);
        } else {
            // poderia fazer redirect para a página de login
            message = JSON.stringify({ message: "Tasks updated successfully" })
            res.status(200).send(message);
        }
    })
})
app.delete("/tasks/:id", (req, res) => {
    // check jwt token authorization header
    const authorization = req.headers.authorization;
    let decoded = "";

    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    try {
        token = authorization.split(" ")[1];
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized");
    }
    // end check

    taskID = req.params.id;
    userID = decoded.userID;
    
    // console.log(taskID, userID);
    db.get("SELECT * FROM tasks WHERE taskID = ? AND userID= ?", [
        taskID,
        userID,
    ], (err, row) => {
        if (err) {
            // console.log(err)
            err = JSON.stringify({ err: "Error deleting task" })
            res.status(500).send(err);
        } else if (row) {
            db.run("DELETE FROM tasks where taskID = ?", [taskID], (err, rows) => {
                if (err) {
                    // console.log(err)
                    err = JSON.stringify({ err: "Error deleting task" })
                    res.status(500).send(err);
                } else {
                    message = JSON.stringify({ message: "Task deleted successfully" })
                    res.status(200).send(message);
                }
            });
        } else {
            err = JSON.stringify({ err: "Task not found" })
            res.status(404).send(err);
        }
    });
});

// diponibilita o acesso da aplicação na porta desejada
app.listen(port, () => {
    console.log(`Example app listening on port :${port}`)
})