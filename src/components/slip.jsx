import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const SLIP_API_TOKEN = import.meta.env.VITE_SLIP_API_TOKEN;
const SLIP_COOKIE = import.meta.env.VITE_SLIP_COOKIE;
const SLIP_API_LINK = import.meta.env.VITE_SLIP_API_LINK;
const BACKEND_API_LINK = import.meta.env.VITE_API_URL;

function SlipUploader({ expectedAmount }) {
    const [file, setFile] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [amountMatch, setAmountMatch] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const access_token = localStorage.getItem('access_token');
    const { id } = useParams();
    
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file, file.name);

        try {
            const response = await fetch(SLIP_API_LINK, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SLIP_API_TOKEN}`,
                    'Cookie': SLIP_COOKIE,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.status === 200) {
                setUploadResponse(data);
                const slipAmount = data.data.amount.amount;

                if (slipAmount === expectedAmount) {
                    setAmountMatch(true);
                    await sendToBackend(data.data);
                } else {
                    setAmountMatch(false);
                    setErrorMessage('Amount does not match the expected amount.');
                }
            } else {
                handleErrors(data.status, data.message);
            }
        } catch (error) {
            console.error('Request failed:', error);
            alert('Error uploading slip. Please try again.');
        }
    };

    const sendToBackend = async (data) => {
        try {
            // Step 1: Send the donation data
            const donationResponse = await fetch(`${BACKEND_API_LINK}/promptpay/donation/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campaign_id: id,
                    amount: data.amount.amount,
                    transaction_id: data.transRef,
                }),
            });
    
            if (!donationResponse.ok) {
                throw new Error('Failed to store donation data in backend');
            }
    
            const donationData = await donationResponse.json();
            const donation_id = donationData.donation_id;
    
    
            if (donation_id > 0) {
                // Send the payment data after the donation data is successfully stored
                const paymentResponse = await fetch(`${BACKEND_API_LINK}/promptpay/payment/${id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        donation_id: donation_id,
                        payment_method: 'promptpay',
                        transaction_id: data.transRef,
                    }),
                });
    
                // Check if the second request is successful
                if (!paymentResponse.ok) {
                    throw new Error('Failed to store payment data');
                }
    
                alert('Donation and payment recorded successfully');
            } else {
                alert('Donation ID is less than or equal to 1, payment will not be processed.');
            }
        } catch (error) {
            console.error('Failed to store data:', error);
            alert('There was an error processing your donation.');
        }
    };    
    const handleErrors = (status, message) => {
        let errorMessage = '';
        switch (status) {
            case 400:
                errorMessage = 'Bad request. Please check the file format.';
                break;
            case 404:
                errorMessage = 'Data not found.';
                break;
            default:
                errorMessage = 'An unexpected error occurred.';
        }
        setErrorMessage(errorMessage);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Upload Slip Image After Your Donation to Keep Us Track on Campaign</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Slip</button>
            {amountMatch !== null && (
                <p>
                    {amountMatch ? 'Amount matches the expected amount.' : 'Amount does not match the expected amount.'}
                </p>
            )}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default SlipUploader;