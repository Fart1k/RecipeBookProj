const app =  require('express')()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')

app.use('./docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const port = 8080

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})