// Dependencias requeridas ===================================================================================
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mustache = require('mustache');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();

try {
    // Contenido certificados ====================================================================================
    const sslOptions = {
        key: fs.readFileSync(path.resolve('./ssl/cert.key')),
        cert: fs.readFileSync(path.resolve('./ssl/cert.crt'))
    };

    // Utilidades de seguridad ===================================================================================
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.disable('x-powered-by');

    // Configurar uso de Mustache ================================================================================
    app.set('views', __dirname+'/static');
    app.set('view engine', 'mustache');
    app.engine('mustache', mustacheExpress());

    // Definir path para contenido estático default ==============================================================
    // app.use(express.static('static'));

    // Endpoints internos ========================================================================================
    const endpoints = [
        { path: '/set',     port: 3001 },
        { path: '/set/api', port: 3002 }
    ];

    // Habilitar endpoint en proxy ===============================================================================
    endpoints.forEach((endpoint) => {
        app.use( endpoint.path, createProxyMiddleware({
            target: `http://localhost:${endpoint.port}`,
            changeOrigin: true
        }));
    });

    // Handling toda solicitud que no encaje con proxy ===========================================================
    app.get('*', (req, res) => {
        return res.status(200).render('index', {
            header: "👰🏻 KuroNeko",
            title: "💻 Bienvenido a mi servidor 🦄",
            message: "Host de todos los proyectos JS que estoy llevando a cabo como pasatiempo.",
            error_uid: uuidv4()
        });
    })

    // Iniciar servidor HTTPS ====================================================================================
    https.createServer(sslOptions, app).listen(443, () => {
        console.log('[🔒] Proxy iniciado en el puerto 443');
    });

    // Iniciar servidor HTTP =====================================================================================
    app.listen(80, () => {
        console.log('[🔓] Proxy iniciado en el puerto 80');
    });
} catch (error) {
    console.error(error.message);
}
