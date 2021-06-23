const express = require("express");
const app = express();
const connection = require("./database/database")
const Participantes = require("./participantes/Participantes")
const nodemailer = require("nodemailer")

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(express.urlencoded({extended: true}));
app.use(express.json());

connection.authenticate().then(() => console.log("conexao feita com sucesso")).catch((error) => {console.log(error)})

app.get("/",(req, res) => {
    Participantes.findAll().then(participantes => {
        res.render("index", {participantes: participantes});
    })
});

app.get("/adicionar",(req, res) => {
    res.render("adicionar");
});

app.post("/salvar",(req, res) => {
    var nome = req.body.Nome;
    var email = req.body.Email;
    if(nome != undefined){
        Participantes.create({
            nome: nome,
            email: email
        }).then(() => {
            res.redirect("/");
        })
    }else{
        res.redirect("/adicionar")
    }
});

app.get("/deletar",(req, res) => {
    var id = req.body.id;
    Participantes.destroy({
        where: {
            id: id,
        }
    }).then(() => {
        res.redirect("/")
    })
});


function EmailE(remetente,amigo,amigoemail){
    var transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "mafalda.stoltenberg@ethereal.email",
          pass: "pQvQ3HWqpPvyf2caxb"
        }
      });
    transporter.sendMail({
        from: "mafalda.stoltenberg@ethereal.email",
        to: remetente,
        subject: "Amigo secreto :)",
        text: "Seu amigo secreto é " + amigo + "email: " + amigoemail,
    }).then(message => {
        console.log(message);
    }).catch(err => {
        console.log(err);
    })
}



app.get("/limpar",(req, res) => {
    var id = req.body.id;
    Participantes.destroy({
        truncate: true, restartIdentity: true
    }).then(() => {
        res.redirect("/")
    })
});

app.get("/sorteado",(req, res) => {
    res.render("sorteado");
});

app.get("/sorteio",(req, res) => {
    
    async function Busca() {
        const emails = await Participantes.findAll({attributes: [`email`, `nome`],raw : true});
        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
          }
        var teste = shuffle(emails);
        var tamanho = teste.length;
        console.log(teste[1].nome);
          
        for (var i = 0; i <= (tamanho - 1); i++) {
            if(i < (tamanho - 1)){
                EmailE(emails[i].email,emails[i+1].nome,emails[i+1].email);
            }else{
                EmailE(emails[i].email,emails[0].nome,emails[0].email);
            }
        }
    }
    Busca();
    res.redirect("/sorteado")
});


app.listen(8080, () => {
    console.log("app rodando!");
});