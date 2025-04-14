const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db')

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, userID INTEGER, username TEXT NOT NULL, done TEXT NOT NULL')
})
const utils = {
    replaceOnListByIndex: (list, index, newdata) => {
        const listCopy = [...list]
        listCopy[index] = newdata
        return listCopy
    }

}
let userProfile = {
    id : undefined,
   name: undefined,
   password: undefined
}
let userTasks = {
    taskId: undefined,
    name: undefined,
    userID: undefined,
    username: undefined,
    done: undefined
}



async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
            console.log("ROW", row)
            resolve(row ? row : undefined)
        })
    })
}

async function getUserTasks(userId) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tasks WHERE userID = ?`, [userId], (err, row) => {
            console.log("ROW", row)
            resolve(row ? row : undefined)
        })
    })
}
app.use(cors({
    origin: 'http://localhost:3001',
}))

// envia no root
app.get('/', (req, res) => {
    // retorna todas as tasks
    db.serialize(() => {
        db.all("SELECT * FROM tasks", (err, rows) => {
            res.send(rows);
        })
    })
});


app.get('/:id', (req, res) => {
    // retorna o perfil
    const { id } = req.params.id


    const userProfile = getUserById(id);
    if (!userProfile) {
        return res.status(404).send('Profile not found')
    }
    res.status(200)
    res.send(userProfile);
});

app.get('/:id/tasks', (req, res) => {
    // retorna as tasks
    const { id } = req.params.id
    const userTasks = getUserTasks(id);
    if (!userTasks) {
        return res.status(404).send('Tasks not found')
    }
    res.status(200)
    res.send(userTasks);
});


app.post('/', (req, res) => {
    // cria um novo usuário
    const { name, password } = req.body

    if (!name) {
        return res.status(400).send('Name is required')
    }

    db.serialize(() => {
        db.run(`INSERT INTO users (name, age) VALUES ('${name}', ${age ? `${age}` : "NULL"})`)
        db.all("SELECT * FROM users ORDER BY id DESC limit 1", (err, row) => {
            res.send(row);
        })
    })
});

app.post('/:id', (req, res) => {
    // cria uma nova task
    const { name, userID, username, done } = req.body

    if (!name) {
        return res.status(400).send('Name is required')
    }
    if (!userID) {
        return res.status(400).send('UserID is required')
    }
    if (!username) {
        return res.status(400).send('Username is required')
    }
    if (!done) {
        return res.status(400).send('Done is required')
    }

    db.serialize(() => {
        db.run(`INSERT INTO tasks (name, userID, username, done) VALUES ('${name}', ${userID}, '${username}', '${done}')`)
        db.all("SELECT * FROM tasks ORDER BY taskId DESC limit 1", (err, row) => {
            res.send(row);
        })
    })
});


app.put('/:id', (req, res) => {
    // muda a senha do perfil
    const { id } = req.params
    const { name, password, newPassword } = req.query
    const userProfile = getUserById(id)

    if (!userProfile) {
        return res.status(404).send('Profile not found')
    }

    if (!name && !password && !newPassword) {
        return res.status(400).send('Name or age is required')
    } 
    db.serialize(() => {
        const attributes = []
        name && attributes.push(`name = '${name}'`)
        newPassword && attributes.push(`password = '${newPassword}'`)
        db.run(`UPDATE users SET ${attributes.join(', ')} WHERE id = ${id}`)
        db.all("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            res.send(row);
        })
    })

})

app.delete('/:id', (req, res) => {
    // remover uma stack
    const { id } = req.params
    const userProfile =  getUserById(id)
    if (!userProfile) {
        return res.status(404).send('Profile not found')
    }
    db.serialize(() => {
        db.run(`DELETE FROM users WHERE id = ${id}`)
        db.all("SELECT * FROM users", (err, rows) => {
            res.send(rows);
        })
    })

});

// diponibilita o acesso da aplicação na porta desejada
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})