const express = require('express');
const fs = require('fs');
const { register } = require('module');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'users.json');


// Middleware для парсинга JSON
app.use(express.json());

// Функция для чтения пользователей из файла
const readUsersFromFile = () => {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
};
// Функция для записи пользователей в файл
const writeUsersToFile = (users) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
};

// Получить всех пользователей
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// Получить пользователя по ID
app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

// Создать нового пользователя
app.post('/users', (req, res) => {
    const users = readUsersFromFile();
    
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1, // Генерация нового ID
        name: req.body.name,
        family: req.body.family,
        age: res.body.age
    };

    users.push(newUser);
    writeUsersToFile(users);

    res.status(201).json(newUser);
});

// Обновить пользователя
app.put('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));

    if (userIndex !== -1) {
        const updatedUser = { id: parseInt(req.params.id), ...req.body };
        users[userIndex] = updatedUser;
        writeUsersToFile(users);
        res.json(updatedUser);
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

// Удалить пользователя
app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const filteredUsers = users.filter(u => u.id !== parseInt(req.params.id));

    if (filteredUsers.length < users.length) {
        writeUsersToFile(filteredUsers);
        res.sendStatus(204); // 204 No Content
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});