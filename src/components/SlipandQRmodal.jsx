import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from './modal.jsx';
import SlipUploader from './Slip.jsx';
import './SlipandQRmodal.css'; // Import the CSS file

function QRCodeGenerator() {
    const [amount, setAmount] = useState('');
    const [qrImage, setQrImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const port = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const timeoutDuration = 60000; // 1 minute

    // Clear QR code after timeout
    useEffect(() => {
        let timer;
        if (qrImage) {
            timer = setTimeout(() => {
                setQrImage(''); // Clear QR code after timeout
            }, timeoutDuration);
        }

        return () => clearTimeout(timer);
    }, [qrImage]);

    const isValidAmount = (amount) => {
        // Ensure the amount is a valid number and greater than 0
        return !isNaN(amount) && amount > 0;
    };

    const genQR = async () => {
        if (!isValidAmount(amount)) {
            alert('Please enter a valid amount.');
            return;
        }

        try {
            const response = await fetch(`${port}/promptpay/generateQR/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    id: id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setQrImage(data.Result);
                setIsModalOpen(true);
            } else {
                console.error('Error generating QR code', response.statusText);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    return (
        <div className="qr-container">
            <h1 className="qr-title">Generate PromptPay QR Code</h1>
            <input  className="qr-input"
                type="text"
                value={amount}
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
            />
            <button  className="qr-button" onClick={genQR}>Generate</button>

            {/* Show modal only if QR code is generated */}
            {qrImage && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <SlipUploader expectedAmount={parseFloat(amount)} />
                    <div className="qr-modal-content">
                        <p className="qr-amount-text">
                            Amount: ฿{amount}
                        </p>
                        <img
                          className="qr-image"
                            src={qrImage}
                            alt="PromptPay QR Code"
                           
                        />
                    </div>
                </Modal>
            )}

            {/* Show message if QR code has expired */}
            {!qrImage && isModalOpen && (
                 <div className="qr-popup">
                    <p>QR code expired. Please generate a new one.</p>
                </div>
            )}
        </div>
    );
}

export default QRCodeGenerator;