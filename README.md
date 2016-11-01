# CAFE_PORTAL
To see detailed information about CAFE, please check the [wiki page](https://github.com/THU-EarthInformationScienceLab/CAFE_NODE/wiki).
##Before Installing CAFE PORTAL
`Notice`: This package can be installed in any web server. You can deploy this package either on Windows paltform or in Linux platform. To ensure the application work correctly, following procedures have to be conducted before your installation:
######1.	Installing MySQL Server and Client (http://www.mysql.com/downloads/ )     
```Bash 
sudo apt-get install mysql-server mysql-client  #For Ubuntu 12.04
sudo service mysql start #open mysql service
``` 
Note: To ensure the correct connection to the database, you may have to modify the file /etc/mysql/my.cnf and annotate the row starts with bind-address
######2.	Installing Apache 2 HTTP Server (http://httpd.apache.org/)   
```Bash 
sudo apt-get install apache2     #For Ubuntu 12.04
``` 
######3.	Installing php5 with extensions (http://php.net/downloads.php)
```Bash 
sudo apt-get install php5 php5-mysql php5-gd php5-tidy php5-curl     #For Ubuntu 12.04
``` 
##Installation procedures
######1.	Database preparation.     
You have to create a user name of your database system, obtain the ip address,access port,username and password
```Bash 
e.g. CREATE USER 'username'@'%' IDENTIFIED BY 'password'; 
```
######2.	Creating a database.      
Create a database. Grand privileges to the user created in step 1.  
```Bash 
e.g. # if the name of your database called userdb
     # you can enter mySQL using command line 'mysql -u guest -p', then use following codes.
     GRANT all privileges ON userdb.* TO 'username'@'%'
     FLUSH PRIVILEGES;
```
######3.	Create database tables.      
The path of initiation script is: `CAFE_PORTAL/init.sql`     
You have to enter mySQL, use the database in step2 and run this script.      
You should first enter the directory `CAFE_PORTAL/init.sql` of the CAFE-PORTAL source code folder.
Then You have to enter mySQL using command line `mysql -u {username} -p`, use the database created in `step2` and run the following script.
```Bash 
use {jdbc.database}
source init.sql;
``` 
######4.	Grand write permission. [For Linux]     
Grand write permission to `ts_search/assets` and `ts_search/protected/runtime`       
######5. Database access configuration.     
Find the file `CAFE_PORTAL/ts_search/protected/config/main.php` and replace the database information from line `57` to line `64`. For example:
```php		
'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=userdb',
			'emulatePrepare' => true,
			'username' => 'guest',
			'password' => '123456',
			'charset' => 'utf8',
            'tablePrefix'=>'ts_',
		 ),
``` 
######6. Server access configuration.       
find the file `CAFE_PORTAL/ts_search/protected/models/TSInterface.php` and modify the NODE server root address in line2, for example, if you want to connect the web appication to the CAFE node configured on 100.101.100.111:8088, the root path in the tomcat server of that node is  `/worker-node`, you can use following code:
```php
define('TSInterfaceROOT','http://100.101.100.111:8088/worker-node/');   
``` 
######7. Modify the virtual directory.     
You should log in the Server as an administrator or with a root account or use sudo mode.  For Ubuntu users:
```Bash 
#if you use apt-get in ubuntu
sudo vi /etc/apache2/sites-enabled/000-default  #Configure the virtual directory After DocumentRoot
sudo /etc/init.d/apache2 restart    #restart Apache
``` 
