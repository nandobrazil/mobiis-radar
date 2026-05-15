pipeline {
  agent any

  environment {
    APP_NAME = 'mobiis-radar-web'
    IMAGE = "mobiis-radar.oconde.dev/${APP_NAME}"
    IMAGE_LATEST = "${env.IMAGE}:latest"
    HOST_PORT = '8998'
    CONTAINER_PORT = '80'
  }

  stages {
    stage('Getting commitID') {
      steps {
        sh "git rev-parse --short HEAD > commit-id"
      }
    }
    stage('Cleaning Docker') {
      steps {
        sh "docker stop ${APP_NAME} || true"
        sh "docker wait ${APP_NAME} || true"
        sh "docker container prune -f"
      }
    }
    stage('Building Docker Image') {
      environment {
        TAG = readFile("commit-id").replace("\n", "").replace("\r", "")
        TAGGED_IMAGE = "${env.IMAGE}:${env.TAG}"
      }

      steps {
        echo "Criando a imagem: ${env.TAGGED_IMAGE}, latest: ${env.IMAGE_LATEST}"
        sh "docker build -t ${env.TAGGED_IMAGE} ."
        sh "docker tag ${env.TAGGED_IMAGE} ${env.IMAGE_LATEST}"

        sh "docker run -d --name ${APP_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} " +
            "-t ${TAGGED_IMAGE}"
      }
    }
  }
}