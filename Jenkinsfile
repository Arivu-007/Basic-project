pipeline {
    agent any

    environment {
        // IMPORTANT: Replace 'YOUR_DOCKERHUB_USERNAME' with your actual Docker Hub username
        REGISTRY    = 'arivu007'
        APP_NAME    = 'basic-project'
        IMAGE_TAG   = "${REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}"
    }

    stages {

        // Stage 1: Pull source code from GitHub
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Install dependencies and run unit tests
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        // Stage 3: Build Docker image and push to Docker Hub
        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        def appImage = docker.build("${IMAGE_TAG}")
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }

        // Stage 4: Dynamically update the image tag in the K8s deployment manifest
        stage('Update K8s Manifest') {
            steps {
                sh """
                    sed -i '' 's|image: .*|image: ${IMAGE_TAG}|' k8s/deployment.yaml
                    echo "Updated deployment.yaml to use image: ${IMAGE_TAG}"
                    cat k8s/deployment.yaml | grep image
                """
            }
        }

        // Stage 5: Apply updated manifests to the Kubernetes cluster
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/'
                    sh 'kubectl rollout status deployment/basic-project --timeout=120s'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully! Image: ${IMAGE_TAG}"
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above for details.'
        }
    }
}
