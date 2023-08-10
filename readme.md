# Project X

Generate accurate meeting notes effortlessly. Users simply register, upload their video or audio files, and receive an email containing a concise meeting summary.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Upload Routes](#upload-routes)
    - [Mail Routes](#mail-routes)
4. [Contributing](#contributing)
5. [License](#license)
6. [Author](#author)

## Installation

1. Clone this repository:

    ```sh
    ghttps://github.com/Amrendra098336/NuggetZoomSummarizationBackend.git
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

## Usage

Provide instructions on how to use the project after installation. Include any configurations, environment variables, and necessary explanations.

```sh
npm start
nodemon
```

## API Endpoints

### User Routes

-   `POST /register`
    -   **Description:** Register a new user.
    -   **Body:**
        -   `firstName`: string
        -   `lastName`: string
        -   `email`: string
        -   `password`: string
        -   `dateOfBirth`: string (format: YYYY-MM-DD)
    -   **Responses:**
        -   `201`: User registered successfully.
        -   `400`: Validation error or user with email already exists.
        -   `500`: Server error.
-   `POST /login`

    -   **Description:** User login.
    -   **Body:**
        -   `email`: string
        -   `password`: string
    -   **Responses:**
        -   `200`: User logged in successfully.
        -   `400`: Invalid request body.
        -   `404`: User not found.
        -   `401`: Invalid credentials.
        -   `500`: Server error.

-   `GET /get/:userEmail`

    -   **Description:** Fetch user information (Requires authentication).
    -   **Parameters:**
        -   `userEmail`: string (email of the user)
    -   **Responses:**
        -   `200`: User information retrieved successfully.
        -   `400`: Invalid email.
        -   `404`: User not found.
        -   `403`: Unauthorized access.
        -   `500`: Server error.

-   `PATCH /update/:userEmail`

    -   **Description:** Update user information (Requires authentication).
    -   **Parameters:**
        -   `userEmail`: string (email of the user)
    -   **Body:**
        -   User object containing fields to be updated.
    -   **Responses:**
        -   `200`: User information updated successfully.
        -   `400`: Invalid email.
        -   `404`: User not found.
        -   `500`: Server error.

-   `PATCH /changepassword/:userEmail`

    -   **Description:** Change user password (Requires authentication).
    -   **Parameters:**
        -   `userEmail`: string (email of the user)
    -   **Body:**
        -   `password`: string (new password)
    -   **Responses:**
        -   `200`: Password updated successfully.
        -   `400`: Invalid email.
        -   `404`: User not found.
        -   `500`: Server error.

-   `DELETE /delete/:userEmail`
    -   **Description:** Delete a user (Requires authentication).
    -   **Parameters:**
        -   `userEmail`: string (email of the user)
    -   **Responses:**
        -   `200`: User deleted successfully.
        -   `400`: Invalid email.
        -   `404`: User not found.
        -   `500`: Server error.

### Upload Routes

-   `POST /uploadToS3`
    -   **Description:** Uploads a file to AWS S3.
    -   **Body:**
        -   `email`: string (Email of the user, required)
        -   `meetingTitle`: string (Title of the meeting, required)
        -   `file`: binary (The recording file to be uploaded)
    -   **Responses:**
        -   `200`: File uploaded successfully to S3 with the file URL.
        -   `400`:
            -   No file uploaded.
            -   Email is required.
            -   Meeting Subject is required.
        -   `500`: Failed to upload file to S3 or Server error.

> **Note**: Ensure that the AWS Bucket name and other required environment variables are properly set in the environment before making a request to this endpoint.

### Mail Routes

-   `POST /sendMail`
    -   **Description:** Sends an email to the specified recipient based on the modifiedFileName provided in the request body.
    -   **Body:**
        -   `modifiedFileName`: string (Name of the file with its extension, used to fetch user and recording details)
        -   `message`: string (The content of the email to be sent)
    -   **Responses:**
        -   `200`: Email sent successfully.
        -   `400`: Validation failed. (Note: This is commented out in the code, but if the validation part is uncommented, you'd have this response)
        -   `404`: No user data found for the given file name.
        -   `500`: Failed to send email or server error.

> **Note**: Before sending the mail, the system fetches the user and recording details associated with the modifiedFileName. The email is sent to the user's email address.

## License

[Include details about the license or link to the license]

## Author

Amrendra Kumar Singh
