# MisDatos

# Servicios

* Regsitrar usuario: correr con comando **node register.js** "puerto en el que se desea correr". Esto desde el directorio register
* login usuario: correr con comando **node login.js** "puerto en el que se desea correr". Esto desde el directorio login
* crear transaccion: correr con comando **node newTransaction.js** "puerto en el que se desea correr". Esto desde el directorio newTransaction
* Obtener puntos de usuario: correr con comando **node points.js** "puerto en el que se desea correr". Esto desde el directorio points
* historial de transacciones: correr con comando **node transactionsHistory.js** "puerto en el que se desea correr". Esto desde el directorio transactions
* desactivar transaccion: correr con comando node **deactivateTransaction.js** "puerto en el que se desea correr". Esto desde el directorio deactivateTransaction
* exportar Excel: correr con comando node **exportExcel.js** "puerto en el que se desea correr". Esto desde el directorio exportExcel

# Body requests for tests

| Servicio                   | path                  | Body                                                                                                                                                                                                                                  | Metodo |
|----------------------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| Registrar usuario          | /register             | {     "name":"nombre",     "last_name":"apellido",     "birthday":"2020-02-07 19:11:11",     "email":"email",     "password":"contrasenia"  } El cumpleanios debe tener el formato especificado                                       | POST   |
| Loguear usuario            | /login                | {     "email":"jularenas2@gmail.com",     "password":"julian"  } no manejo jwt, no se tiene nocion de una sesion iniciada                                                                                                             | POST   |
| Crear transaccion          | /crearTransaccion     | {     "value": 150,     "points": 10,     "email": "jularenas2@gmail.com"  }  con nocion de sesion se usaria el usuario logueado, utiliza email para asociarlo a un usuario y pedir el historial de transacciones (no cascade delete) | POST   |
| Historial de transacciones | /transatcionsHistory  | {     "email":"jularenas2@gmail.com"  } solicita el historial del usuario con el email del body                                                                                                                                       | GET    |
| Puntos                     | /puntos               | {     "email":"jularenas2@gmail.com"  }  Solicita la suma de los puntos del usuario con el email dado  (de las transacciones activas)                                                                                                 | GET    |
| Inactivar Transaccion      | /inactivarTransaccion | {     "transaction_id":1       }cambia el status de la transaccion con ese id a 0 (inactiva)                                                                                                                                          | PUT    |
| Exportar Excel             | /exportExcel          |  {"email":"jularenas2@gmail.com"}exporta el excel de transacciones del usuario con el email dado (descargable con postman, send and download response )                                                                               | GET    |






