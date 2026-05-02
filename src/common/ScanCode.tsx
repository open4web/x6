import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
    onScanSuccess: (code: string) => void;
    onScanLimitReached?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanLimitReached }) => {
    const qrCodeRegionId = "qr-code-region";
    const scanLimit = 100;
    const [scanCount, setScanCount] = useState(0);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = html5QrCode;

        const config = { fps: 5, qrbox: { width: 250, height: 250 } };

        const handleScanSuccess = (decodedText: string) => {
            if (!isMountedRef.current) return;
            console.log(`Scanned Code: ${decodedText}`);
            setScanCount((prev) => prev + 1);
            stopScanner(); // 扫描成功后停止
            onScanSuccess(decodedText);
        };

        const handleScanError = (error: any) => {
            if (!isMountedRef.current) return;
            setScanCount((prev) => {
                const newCount = prev + 1;
                if (newCount >= scanLimit) {
                    stopScanner();
                    if (onScanLimitReached) onScanLimitReached();
                }
                return newCount;
            });
        };

        const stopScanner = async () => {
            if (!scannerRef.current) return;
            try {
                // 检查是否正在扫描（可选，但调用 stop 总是安全）
                await scannerRef.current.stop();
                console.warn("Scanner stopped.");
            } catch (error) {
                console.error("Error stopping scanner:", error);
                // 若停止失败，尝试强制清除视频流（低级操作）
                const videoElement = document.querySelector(`#${qrCodeRegionId} video`);
                if (videoElement && (videoElement as any).srcObject) {
                    const stream = (videoElement as any).srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                    (videoElement as any).srcObject = null;
                }
            } finally {
                scannerRef.current = null;
            }
        };

        const startScanner = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    handleScanSuccess,
                    handleScanError
                );
            } catch (error) {
                console.error("Error starting scanner:", error);
                if (isMountedRef.current) {
                    // 启动失败，主动停止并清理
                    await stopScanner();
                }
            }
        };

        startScanner();

        return () => {
            isMountedRef.current = false;
            // 组件卸载时强制停止摄像头
            if (scannerRef.current) {
                // 不等待异步结果，直接尽力停止
                scannerRef.current.stop().catch(err => {
                    console.warn("Async stop failed, fallback to manual cleanup", err);
                    // 降级：手动清除视频流
                    const videoElement = document.querySelector(`#${qrCodeRegionId} video`);
                    if (videoElement && (videoElement as any).srcObject) {
                        const stream = (videoElement as any).srcObject as MediaStream;
                        stream.getTracks().forEach(track => track.stop());
                        (videoElement as any).srcObject = null;
                    }
                });
                scannerRef.current = null;
            }
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