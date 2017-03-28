# unchained

## Installation (soon[TM])
1. [Get Docker](https://docs.docker.com/engine/getstarted/step_one/#/step-1-get-docker)
2. [Get Docker Compose](https://docs.docker.com/compose/install/)
4. Clone this repo: `git clone https://github.com/mhacks/unchained`
4. Change directory to the deploy repo: `cd unchained/deploy/`
5. Start whatever environment you want
    - Development
        - `docker-compose -f development.yml up -d`
        - **NOTE: Your git repo will be linked to the development environment, so your local changes will be reflected with a container restart**
    - Production (You're gonna need some more env data)
        - `docker-compose -f production.yml up -d`
        - **NOTE: This takes care of setting up NGINX AND LetsEncrypt with the appropriate hosts (and autorenewal!).**
6. Access `http://localhost:3000` and start developing!