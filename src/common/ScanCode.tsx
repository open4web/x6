import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
    onScanSuccess: (code: string) => void; // 扫描成功时的回调函数
    onScanLimitReached?: () => void; // 超过限制时的回调函数
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanLimitReached }) => {
    const qrCodeRegionId = "qr-code-region";
    const scanLimit = 100; // 扫描限制次数
    const [scanCount, setScanCount] = useState(0);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        const config = { fps: 5, qrbox: { width: 250, height: 250 } };

        const handleScanSuccess = (decodedText: string) => {
            console.log(`Scanned Code: ${decodedText}`);
            setScanCount((prev) => prev + 1);
            stopScanner(); // 停止扫描
            onScanSuccess(decodedText);
        };

        const handleScanError = () => {
            setScanCount((prev) => {
                const newCount = prev + 1;
                if (newCount >= scanLimit) {
                    stopScanner(); // 达到限制次数，停止扫描
                    if (onScanLimitReached) onScanLimitReached();
                }
                return newCount;
            });
        };

        const stopScanner = async () => {
            try {
                await html5QrCode.stop();
                console.warn("Scanner stopped.");
            } catch (error) {
                console.error("Error stopping scanner:", error);
            }
        };

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" }, // 后置摄像头
                    config,
                    handleScanSuccess,
                    handleScanError
                );
            } catch (error) {
                console.error("Error starting scanner:", error);
                stopScanner();
            }
        };

        startScanner();

        // 清理函数，组件卸载时停止扫描器
        return () => {
            stopScanner();
        };
    }, [onScanSuccess, onScanLimitReached]);

    return (
        <div>
            <h2>Scan QR Code</h2>
            <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px", margin: "auto" }}></div>
            <p>Scan Attempts: {scanCount}/{scanLimit}</p>
        </div>
    );
};

export default QRScanner;