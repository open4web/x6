import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScanSuccess: (code: string) => void; // 扫描成功时的回调函数
    onScanLimitReached?: () => void;      // 超过限制时的回调函数
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanLimitReached }) => {
    const qrCodeRegionId = "qr-code-region";
    const [scanCount, setScanCount] = useState(0); // 记录扫描尝试次数

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        const config = { fps: 5, qrbox: { width: 250, height: 250 } };

        html5QrCode
            .start(
                { facingMode: "environment" }, // 后置摄像头
                config,
                (decodedText) => {
                    console.log(`Scanned Code: ${decodedText}`);
                    setScanCount((prev) => prev + 1); // 增加扫描计数
                    onScanSuccess(decodedText); // 调用成功回调
                    // 达到限制次数，停止扫描
                    html5QrCode.stop().then(() => {
                        console.warn("Scan successful. Stopping scanner.");
                    });
                },
                (errorMessage) => {
                    setScanCount((prev) => {
                        const newCount = prev + 1;
                        if (newCount >= 100) {
                            // 达到限制次数，停止扫描
                            html5QrCode.stop().then(() => {
                                console.warn("Scan limit reached. Stopping scanner.");
                                if (onScanLimitReached) onScanLimitReached(); // 通知父组件
                            });
                        }
                        return newCount;
                    });
                }
            )
            .catch((err) => {
                console.error("Error starting scanner: ", err);
                // 达到限制次数，停止扫描
                html5QrCode.stop().then(() => {
                    console.warn("Scan failed. Stopping scanner.");
                });
            });

        // 清理函数，组件卸载时停止扫描器
        return () => {
            html5QrCode.stop().catch((err) => console.error("Error stopping scanner: ", err));
        };
    }, [onScanSuccess, onScanLimitReached]);

    return (
        <div>
            <h2>Scan QR Code</h2>
            <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px", margin: "auto" }}></div>
            <p>Scan Attempts: {scanCount}/100</p>
        </div>
    );
};

export default QRScanner;