<h1 align="center">
  Stitch Index App
  <br>
  <img src="https://raw.githubusercontent.com/cqyao/Stitch-Index-App/refs/heads/main/assets/images/Logo.png" alt="stitch logo" title="stitch logo" width="200">
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Mobile platform designed to streamline and support the professional needs of doctors.</p>

<hr />


<div align="center">

[![Expo](https://img.shields.io/badge/Expo-v51.0.36-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-v0.74.5-blue.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)](https://firebase.google.com/)

<br><br>

<img src="assets/images/cert.png" alt="3rd Place Certificate" width="300">

</div>

## Features

- **Appointment Calendar**: View and manage upcoming and past appointments using an intuitive calendar.
- **Patient Management**: Access patient profiles, track symptoms, and store relevant data.
- **Collaborative Forum**: Engage with peers, share research, and collaborate on medical cases. Supports media sharing.
- **Courses & Educational Content**: Create, upload, and subscribe to courses and tutorials aimed at continued medical education.

## Installation

### Prerequisites

- **Node.js** (>=22.x.x)
- **Expo CLI** (>=6.x.x)
- **Firebase Project**

### Setup

Clone the repository:

```bash
git clone https://github.com/cqyao/Stitch-Index-App.git
cd Stitch-Index-App
```

Install the dependencies:

```bash
npm install
```

Ensure that you have Expo CLI installed globally. If not, you can install it with:

```bash
npm install -g expo-cli
```

### Firebase Setup

1. Create a new project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore** and **Firebase Authentication**.
3. Copy your Firebase configuration and create a `.env` file in the root of the project with the following filled out:

```bash
FIREBASE_API_KEY = 
FIREBASE_AUTH_DOMAIN = 
FIREBASE_PROJECT_ID = 
FIREBASE_STORAGE_BUCKET = 
FIREBASE_MESSAGING_SENDER_ID = 
FIREBASE_APP_ID = 
FIREBASE_MEASUREMENT_ID = 
OPENAI_KEY = 
```

### Running the App

Run the app locally using Expo:

```bash
expo start
```

This will start the Expo development environment and provide you with options to run the app on an iOS simulator, Android emulator, or physical device.

## Functionalities

### Calendar for Appointments

- Manage your upcoming and past appointments with the intuitive calendar UI.
- Easily reschedule, edit, or delete appointments.

### Patient Management

- Access patient profiles, track symptoms, and manage patient information.
- Add notes or update patient data in real time.

### Forum for Collaboration

- Engage with peers in medical discussions and case collaborations.
- Share images and media directly in the forum.

### Courses and Content Creation

- Create and upload medical tutorials, presentations, or instructional videos.
- Subscribe to or engage with content created by other medical professionals.

## Contributing

We welcome contributions to improve the **Stitch Index App**. If you have suggestions for features or spot bugs, feel free to [open an issue](https://github.com/cqyao/Stitch-Index-App/issues) or submit a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

The **Stitch Index App** is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
