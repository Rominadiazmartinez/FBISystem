const express = require('express')
const agentes = require('./data/agentes.js')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
console.log("El servidor está inicializado en el puerto 3000");
});

const secretKey = "Autenticacion agente"
const token = jwt.sign(agentes.results[1], secretKey)

app.get("/", async(req, res)=>{
    try {
        res.sendFile(__dirname + "/index.html") 
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
})

app.post("/SignIn", (req, res) => {
        const { email, password } = req.body
        const agente = agentes.results.find((agente) => agente.email == email && agente.password == password)
            if (agente) {
                const token = jwt.sign(
                {
                exp: Math.floor(Date.now() / 1000) + 120,
                data: agente,
                },
                secretKey
                );
                res.send(`
                <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
                Bienvenido, ${email}.
                <script>
                localStorage.setItem('token', JSON.stringify("${token}"))
                </script>
                `);
                } else {
            res.send("Usuario o contraseña incorrecta")
    }
});

app.get("/dashboard", (req, res) => {
    const token = req.query.token;
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.status(401).send("Acceso no autorizado");
            } else {
                res.send(`<p>Bienvenido al dashboard, ${decoded.data.email}.</p>`);
            }
        });
    } 
});