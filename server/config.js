const config = {
    server:{
        default: {
            port:3000
        },
        development: {
            port:3000
        },
        production:{
            port:8080
        }
    },
    mongo:{
        default:{
            url:'mongodb://localhost/casebrief',
            useMongoClient:true
        }
    }
}

export default config