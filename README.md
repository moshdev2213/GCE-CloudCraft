
# GCE-CloudCraft CI/CD Configuration

<img width="1722" alt="Frame 2 (1)" src="https://github.com/user-attachments/assets/c0f4a3c7-929f-456c-9c16-d8e6a6c440e9">

## 👀 Overview

Welcome to **GCE-CloudCraft**! This project showcases a React Vite application deployed on Google Cloud Platform (GCP) using a Virtual Machine (VM) and an Nginx server. The deployment process ensures security by utilizing Ngrok to expose a dynamic URL, protecting the server's IP from direct public exposure. CI/CD is efficiently managed with GitHub Actions. 

## 📚 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Deployment](#deployment)
- [Usage](#usage)
- [SSH Key Generation](#ssh-key-generation)
- [CI/CD Configuration](#cicd-configuration)

## 🌟 Features

- 🚀 **Dynamic URL** exposure via Ngrok
- 🔒 **Secure server** deployment with Nginx
- 🔄 **CI/CD** using GitHub Actions for seamless updates
- ⚡ **Optimized build process** with Vite for fast performance

## 🛠️ Prerequisites

Make sure you have the following before getting started:

- A Google Cloud account 💻
- A Virtual Machine (VM) set up in GCP ☁️
- Ngrok installed on your VM 📦
- Node.js (version 20 or higher) installed on your development machine 🌱

## 🚀 Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/GCE-CloudCraft.git
   cd GCE-CloudCraft
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server locally**:

   ```bash
   npm run dev
   ```

## 🌍 Deployment

### Using Ngrok and Nginx

1. **Start Ngrok**: Open a terminal on your GCP VM and run:

   ```bash
   ngrok http 80
   ```

   This command provides a public URL that tunnels to your server. 🔗

2. **Configure Nginx**: Ensure that your Nginx is set up to serve your React Vite app from the `/var/www/html/` directory. 

3. **Build the Vite React app**:

   ```bash
   npm run build
   ```

4. **Copy the build files to the VM**:

   Use the following command to copy your build files to the VM:

   ```bash
   rsync -avz -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" ./dist/ username@vm_ip:/var/www/html/
   ```

## 🔑 SSH Key Generation

To enable secure access to the GCP VM, SSH keys were generated using **MobaXterm**. Here’s how you can generate and set up your SSH keys:

1. **Generate SSH Keys with MobaXterm**:
   - Open MobaXterm and navigate to the **Tools** menu.
   - Select **MobaKeyGen (SSH key generator)**.
   - Click on **Generate** and move your mouse to create randomness.
   - Once the keys are generated, save the private key to a secure location on your local machine and copy the public key.

2. **Set Up SSH Key in GCP VM Metadata**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to your project and select **Compute Engine** > **VM instances**.
   - Click on the name of your VM instance to edit it.
   - Scroll down to the **SSH Keys** section and click **Edit**.
   - Paste your public key in the provided field. It should look like this:  
     `your_email@example.com:ssh-rsa AAAAB3...`
   - Click **Save** to apply the changes.

3. **Add Private Key to GitHub Secrets**:
   - In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
   - Click on **New repository secret**.
   - Name the secret `GCE_SSH_KEY` and paste your private key into the value field.
   - Click **Add secret**. 

This setup allows for secure SSH access to your VM without exposing sensitive credentials.

## 🌐 Usage

After deployment, access your application through the dynamic Ngrok URL provided. This setup ensures your server's IP is not directly exposed to the public, enhancing security. 🛡️

## 🔧 CI/CD Configuration

This project utilizes GitHub Actions for CI/CD, allowing automatic deployments upon pushes to the master branch. The workflow manages the checkout, build, and deployment processes seamlessly.

**Steps involved in the GitHub Actions workflow:**

1. Checkout the repository
2. Set up Node.js environment
3. Install dependencies and build the Vite React app
4. Configure SSH key for secure access to the GCP VM
5. Use rsync to transfer build files to the VM
6. Execute commands to install and restart Nginx on the VM


## GitHub Actions Workflow

### 1. **Workflow Trigger** 🎯

The workflow is triggered on a push to the `master` branch. This ensures that only code that has been pushed to the main branch will initiate a deployment.

```yaml
on:
  push:
    branches:
      - master
```

### 2. **Job Definition** 👷‍♂️

The `deploy` job runs on an `ubuntu-latest` virtual environment. This job includes all the steps necessary for building and deploying the application.

```yaml
jobs:
  deploy:
    name: Deploy to GCE
    runs-on: ubuntu-latest
```

### 3. **Checkout Code** 📥

This step checks out the code from the repository so that the workflow has access to it. The `actions/checkout` action is used for this purpose.

```yaml
- name: Checkout the code
  uses: actions/checkout@v4
```

### 4. **Set Up Node.js** ⚙️

Here, we set up the Node.js environment with the specified version (20 in this case). This is crucial for installing dependencies and building the React application.

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```

### 5. **Install Dependencies and Build the Vite React App** 🛠️

This step installs the required npm dependencies and builds the Vite React application. The build output is typically stored in the `dist` directory.

```yaml
- name: Install dependencies and build
  run: |
    npm install
    npm run build
```

### 6. **Set Up SSH Key** 🔑

In this step, we configure the SSH key for secure access to the GCP VM. The secret keys are stored in GitHub Secrets to protect sensitive information.

```yaml
- name: Set up SSH key
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.GCE_SSH_KEY }}" > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key
    ssh-keyscan -H ${{ secrets.GCE_HOST_IP }} >> ~/.ssh/known_hosts
```

### 7. **Rsync Files to the GCE Server** 📤

Using `rsync`, this step transfers the built files from the local `dist` directory to the `/var/www/html/` directory on the GCP VM. This ensures that the latest build is deployed.

```yaml
- name: Rsync files
  run: |
    rsync -avz -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" ./dist/ ${{ secrets.GCE_USERNAME }}@${{ secrets.GCE_HOST_IP }}:/var/www/html/
```

### 8. **Execute Remote Commands on the GCE Instance** 💻

This step runs several commands on the GCP VM using SSH to set up Nginx, install it if necessary, and start the service. This ensures that your application is served correctly.

```yaml
- name: Execute remote ssh commands using ssh key
  uses: appleboy/ssh-action@v1.1.0
  with:
    host: ${{ secrets.GCE_HOST_IP }}
    username: ${{ secrets.GCE_USERNAME }}
    key: ${{ secrets.GCE_SSH_KEY }}
    script: |
      # Update package index
      sudo apt-get -y update
      
      # Install Nginx
      sudo apt-get install -y nginx
      
      # Start and enable Nginx service
      sudo systemctl start nginx
      sudo systemctl enable nginx
      
      # Restart Nginx to apply changes
      sudo systemctl restart nginx
```

---
