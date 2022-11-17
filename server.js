const express = require('express');
const app = express();
const Container = require('./containerProducts/container');
const container1 = new Container();
const routerProducts = express.Router()
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/products', routerProducts);
app.set('views', './views');
app.set('view engine', 'ejs');

let display = true;

app.get('/', (req, res) => {
    display = true;
    res.render('pages/index', {display});
});

routerProducts.get('/', (req, res) => {
    display = false;
    const products = [container1.getAll];
    res.render('pages/index', {display, products});
});

routerProducts.post('/', async (req, res) => {
    const promiseProducts = async function () {
        const { name, price, inStock } = await req.body;
        const products = container1.save(name, price, inStock);
        return sendProducts(products);
    };

    const sendProducts = async (products) => {
        Promise.all([ products ])
            .then((values) => {
                const products = values;
                display = false;
                res.render('pages/index', {display, products})
            });
    };
    
    promiseProducts();
});

const arrayMessages = [];

io.on('connection', (socket) => {
    console.log(`✔ User connected`);
    socket.on('message', data => {
        arrayMessages.push( { email: data.email, dateTime: data.dateTime, message: data.message } )
        io.sockets.emit('messages', arrayMessages);
    })
});

const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(
        `Server started on PORT http://127.0.0.1:${PORT} at ${new Date().toLocaleString()}`
    );
});

server.on('error', error => console.log(`ERR! ${error}`));