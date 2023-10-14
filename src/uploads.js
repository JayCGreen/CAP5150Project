
import axios from 'axios';
import './App.css';
import React, { Component } from 'react';
import {Button, Content, darkTheme, Flex, Provider, TextField} from '@adobe/react-spectrum';


function getMessageEncoding(message) {
    const enc = new TextEncoder();
    return enc.encode(message);
}
  
function encryptMessage(key, message) {
    const encoded = getMessageEncoding(message);
    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    return window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded,
    );
}
 
class Upload extends Component {
 
    state = {
 
        // Initially, no file is selected
        selectedFile: null
    };
 
    // On file select (from the pop up)
    onFileChange = event => {
 
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
 
    };
 
    // On file upload (click the upload button)
    onFileUpload = () => {

        //encrypt the data
            console.log(this.fileData)
            this.state.selectedFile.text().then((T)=>{
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
                        this.state.selectedFile,
                        encMess,
                        this.state.selectedFile.name
                    );

                    // Details of the uploaded file
                    console.log(this.state.selectedFile);
 
                    // Request made to the backend api
                    // Send formData object
                    axios.post("api/uploadfile", formData);
                });
            })
 
    };
 
    // File content to be displayed after
    // file upload is complete
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
 
                    <p>File Type: {this.state.selectedFile.type}</p>
 
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
 
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };
 
    render() {
 
        return (
            <header className="App-header">
                    <h3>
                        Upload your File
                    </h3>
                    <div>
                        <input type="file" onChange={this.onFileChange} />
                        <Button onClick={this.onFileUpload}>
                            Encrypt & Upload
                        </Button>
                    </div>
                    {this.fileData()}
            </header>
        );
    }
}
 
export default Upload;