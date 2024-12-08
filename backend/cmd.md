Here’s how you can run two Docker containers: one for MySQL and another for phpMyAdmin, while also setting up a volume for MySQL data persistence.

### 1. **Command to Run MySQL Container**
Run this command to start a MySQL container with a named volume for data persistence:
```powershell
docker run -d `
--name mysql-container `
-e MYSQL_ROOT_PASSWORD=rootpassword `
-e MYSQL_DATABASE=mydb `
-e MYSQL_USER=myuser `
-e MYSQL_PASSWORD=mypassword `
-v mysql_data:/var/lib/mysql `
-p 3306:3306 `
mysql:latest
```

### 2. **Command to Run phpMyAdmin Container**
Run this command to start a phpMyAdmin container linked to the MySQL container:
```bash
docker run -d `
--name phpmyadmin-container `
--link mysql-container:db `
-e PMA_HOST=mysql-container `
-p 8080:80 `
phpmyadmin/phpmyadmin:latest

```

### 3. **Database Connection URL**
You can use the following database URL to connect your backend to the MySQL container:
```
mysql://myuser:mypassword@localhost:3306/mydb
```

### Explanation:
1. **MySQL Container**
   - `MYSQL_ROOT_PASSWORD`: Sets the root password.
   - `MYSQL_DATABASE`: Creates a database named `mydb`.
   - `MYSQL_USER` and `MYSQL_PASSWORD`: Create a user `myuser` with the password `mypassword`.
   - `-v mysql_data:/var/lib/mysql`: Persists data in a Docker volume named `mysql_data`.
   - `-p 3306:3306`: Maps port 3306 on the host to the container.

2. **phpMyAdmin Container**
   - `--link mysql-container:db`: Links the phpMyAdmin container to the MySQL container.
   - `PMA_HOST`: Points phpMyAdmin to the MySQL container.
   - `-p 8080:80`: Maps port 8080 on the host to port 80 in the phpMyAdmin container.

3. **Database URL**
   - Format: `mysql://username:password@host:port/database`.
   - Replace `myuser`, `mypassword`, `localhost`, `3306`, and `mydb` with your specific values.

### Volume Persistence
The `mysql_data` volume ensures that your database data is not lost if the container stops or is removed.

Let me know if you need further assistance!