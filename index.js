import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";
import { randomBytes } from 'crypto';

const domains = ["google.com", "youtube.com"];

const userCredentials = [
  { username: "dummy1", password: "pass1" },
  { username: "dummy2", password: "pass2" },
  { username: "dummy3", password: "pass3" },
  // Add more usernames and passwords as needed
];

const getRandomDomain = () => {
  const randomIndex = Math.floor(Math.random() * domains.length);
  return domains[randomIndex];
};

const getRandomURL = () => {
  const domain = getRandomDomain();
  const randomBytesHex = randomBytes(8).toString('hex');
  return `https://www.${domain}/${randomBytesHex}`;
};

inquirer
  .prompt([
    {
      type: "confirm",
      message: "Do you want to generate a QR code?",
      name: "generateQR",
    },
  ])
  .then((answers) => {
    if (answers.generateQR) {
      return inquirer.prompt([
        {
          message: "Enter your username: ",
          name: "username",
        },
        {
          message: "Enter your password: ",
          name: "password",
          type: "input",
        },
      ]);
    } else {
      throw new Error("QR code generation canceled by user.");
    }
  })
  .then((credentials) => {
    // Check if the entered credentials match any valid username and password
    const isValidCredentials = userCredentials.some(
      (cred) => cred.username === credentials.username && cred.password === credentials.password
    );

    if (isValidCredentials) {
      const url = getRandomURL();
      var qr_svg = qr.image(url);
      qr_svg.pipe(fs.createWriteStream("qr_img.png"));

      fs.writeFile("URL.txt", url, (err) => {
        if (err) throw err;
        console.log("QR code and URL saved successfully!");
      });
    } else {
      throw new Error("Invalid username or password. QR code generation canceled.");
    }
  })
  .catch((error) => {
    console.error(error.message);
  });

