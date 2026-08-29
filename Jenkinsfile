pipeline {
    agent any

    environment {
        PATH        = "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                        docker build -t ${IMAGE_TAG} .
                        docker tag ${IMAGE_TAG} ${REGISTRY}/${APP_NAME}:latest
                        docker push ${IMAGE_TAG}
                        docker push ${REGISTRY}/${APP_NAME}:latest
                    """
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
                sh 'KUBECONFIG=/Users/bublee/.kube/config kubectl apply -f k8s/'
                sh 'KUBECONFIG=/Users/bublee/.kube/config kubectl rollout status deployment/basic-project --timeout=120s'
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
