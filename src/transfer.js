
import axios from 'axios';
import './App.css';
import React, { Component, useState} from 'react';
import Web3 from 'web3';
import {Button, Content, darkTheme, Flex, Provider, TextField} from '@adobe/react-spectrum';
import App from './App';

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Replace with the contract address
const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "trustedUser1",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "authorizedAccess",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "user",
                "type": "address"
            }
        ],
        "name": "grantAccess",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "user",
                "type": "address"
            }
        ],
        "name": "revokeAccess",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "cid",
                "type": "string"
            }
        ],
        "name": "storeCID",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545"); // Replace with your Ethereum provider
const contract = new web3.eth.Contract(contractABI, contractAddress);
let pendingCID;

function storeCID() {
    const cid = document.getElementById("shareCIDInput").value;
    const fromAddress = document.getElementById("fromAddress").value; // Retrieve the "from" address

    if (cid && fromAddress) {
        contract.methods.storeCID(cid).send({ from: fromAddress })
            .on("transactionHash", function (hash) {
                console.log("Transaction hash:", hash);
                document.getElementById("storeStatus").textContent = "Transaction sent. Waiting for confirmation...";
            })
            .on("receipt", function (receipt) {
                console.log("Transaction receipt:", receipt);
                document.getElementById("storeStatus").textContent = "CID stored successfully on the blockchain.";
            })
            .on("error", function (error) {
                console.error("Error:", error);
                document.getElementById("storeStatus").textContent = "Error storing the CID.";
            });
    } else {
        alert("Please enter the CID and your Ethereum address.");
    }
}

    async function uploadToWeb3Storage(file, apiKey) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://api.web3.storage/upload", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById("uploadStatus").textContent = `Upload successful! CID: ${result.cid}`;
                pendingCID = result.cid;
            } else {
                document.getElementById("uploadStatus").textContent = "Upload failed. Please check your API token.";
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("uploadStatus").textContent = "Upload failed. Please check your API token.";
        }
    }

    function uploadFile() {
        const fileInput = document.getElementById("fileInput");
        const apiTokenInput = document.getElementById("apiTokenInput");
        const file = fileInput.files[0];
        const apiKey = apiTokenInput.value;

        if (file && apiKey) {
            file.text().then((T)=>{
                window.crypto.subtle.generateKey(
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                  ).then((key) => {
                    const encMess = encryptMessage(key, T);
                    //create form for the data
                    const formData = new FormData();
    
                    // Update the formData object
                    formData.append(
                        "myFile",
                        file,
                        encMess,
                        file.name,
                        key
                    );
    
                    // Details of the uploaded file
                    console.log(file);
    
                    // Request made to the backend api
                    // Send formData object
                    uploadToWeb3Storage(formData, apiKey);
                });
            })
        } else {
            alert("Please select a file and enter your API token.");
        }
    }

    //const [token, setToken] = useState('');

class Transfer extends Component {
    
    

    state = {
 
        // Initially, no file is selected
        selectedFile: null,
        userToken:null
    };
 
    // On file select (from the pop up)
    onFileChange = event => {
 
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
 
    };
 
    render() {
        return (
            <header className="App-header">
                <head>
                    <title>Web3.Storage File Upload and Data Sharing</title>
                </head>
                <body>
                    <h1>Web3.Storage File Upload</h1>
                    <input type="file" id="fileInput" accept=".txt, .pdf, .doc, .docx" />
                    <input type="text" id="apiTokenInput" placeholder="Enter your API token" />
                    <button onclick={()=>uploadFile()}>Upload</button>
                    <div id="uploadStatus"></div>

                    <h1>Data Sharing</h1>
                    <input type="text" id="shareCIDInput" placeholder="Enter the CID" />
                    <input type="text" id="fromAddress" placeholder="Enter your Ethereum address" />
                    <button onclick={()=>storeCID()}>Store CID</button>
                    <div id="storeStatus"></div>

                    <script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
                </body>
            </header>
        );
    }
}
 
export default Transfer;