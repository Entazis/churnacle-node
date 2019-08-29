# Churnacle project

The project is an end-to-end churn reduction system which starts with raw user data and ends with sending emails.

### Prerequisites

You will need Node.js and R environments for development and testing. Docker should be used for deployment.


### Installing

Modify the following lines in docker/node_docker/churnacle_master.js and give the right sources of the databases.

```
var url_central = 'mongodb://localhost:27017/db_central';
var url_orange = 'mongodb://localhost:27017/db_orange';
```

Run docker-compose up in the docker folder, it sets up the containers and shared folders.

```
docker-compose up
```

Run the following command in the node container to acquire data for processing:

```
node churnacle_master.js
```

After some time, run the command in the R container (it takes ~30 minutes recently to run):

```
Rscript churnacle.R
```

And then you could run the final command in node container:

```
node churnacle_messaging.js
```

The program sends emails with the dev server, you can modify these lines to use another server

```
var intercom = new Intercom.Client({
    appId: 'XXXXXXX',
    appApiKey:  'XXXXXXXXXXXXXXXXXXXXXXXXXXX'
});
```

Don't forget to change the email templates if needed. It uses just the hungarian version:

```
			var subject = "[CodeBerry] Egy gyors kérdés";
            var body = "Kedves "+user.name.split(' ')[0]+"!\n" +
                "\n" +
                "Egy gyors kérdés: minden oké?\n" +
                "\n" +
                "Elég, ha egy betűt válaszolsz:\n" +
                "\n" +
                "a) igen, köszi, minden oké\n" +
                "b) nem, valahol elakadtam\n" +
                "c) egyéb:\n" +
                "\n" +
                "\n" +
                "Ha pedig szeretnél beugrani most\n" +
                "csak 5 percet programozni tanulni, \n" +
                "kattints:\n" +
                "http://orange.codeberryschool.com \n";
```

## Built With

* [Rstudio](https://www.rstudio.com/) - The data science framework used
* [Webstorm](https://www.jetbrains.com/webstorm/) - For puppet master development
* [Docker](https://www.docker.com/)

## Authors

* **Szabó Bence**

CodeBerry and its RSC-team are also participating in this project.

