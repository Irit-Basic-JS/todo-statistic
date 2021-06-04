const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commands = command.split(' ');
    let todos = getAllTodos();
    let result;
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            result = todos;
            break;
        case 'important':
            result = getImportant(todos)
            break;
        case 'user':
            result = getUserTodos(todos, commands[1]);
            break;
        case 'sort':
            switch (commands[1]) {
                case 'importance':
                    result = sortImportance(todos);
                    break;
                case 'user':
                    result = sortUser(todos);
                    break;
                default:
                    result = sortDate(todos);
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }

    writeCommand(result);
}

function sortDate(todos) {
    return todos.slice().sort((a, b) => getDate(b).localeCompare(getDate(a)));
}

function sortUser(todos) {
    return todos.slice().sort((a, b) => getUser(a).localeCompare(getUser(b)));
}

function getImportant(todos) {
    return todos.filter(todo => todo.includes('!'));
}

function sortImportance(todos) {
    return todos.slice().sort((a, b) => (b.match(/!/gi)?.length || 0) - (a.match(/!/gi)?.length || 0));
}

function getAllTodos() {
    let files = getFiles();
    return files
        .map(file => file
            .split("\r\n")
            .map(str => str.trim())
            .filter(str =>
                str.includes('// TODO')
                && !str.includes("\'// TODO")
                && !str.includes("\"// TODO")
                && !str.includes("\`// TODO")
            )
            .map(str => str.slice(str.indexOf('// TODO')))
        )
        .flat();
}

function writeTODOs(todos) {
    console.log("TODO list: ");
    console.log(todos.join('\n'));
}

function getUserTodos(todos, user) {
    return todos.filter(todo =>
        todo.includes(';')
        && getUser(todo).toLowerCase() === user);
}

function getUser(todo) {
    return todo.slice('// TODO'.length, todo.indexOf(';')).trim();
}

function getDate(todo) {
    return todo.slice(todo.indexOf(';'), todo.indexOf(';', todo.indexOf(';') + 1)).trim();
}

function writeCommand(todos) {
    console.log("=====================================");
    writeTODOs(todos);
    console.log("=====================================");
}

// TODO you can do it!
