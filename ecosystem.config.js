module.exports = {
    apps : [{
        name      : "ProxyCat",
        varsion   : "1.0.0",

        script    : "./proxy.js",
        exec_mode : "fork",

        watch : true,
        max_restarts : 10,

        cron_restart: '0 5 * * *',

        ignore_watch : [
            "logs",
            "node_modules"
        ],

        watch_options: {
            "followSymlinks": false
        },

        log_date_format : "YYYY-MM-DD HH:mm",
        error_file : "./logs/errors.log",
        out_file   : "./logs/out.log"
    }]
}
