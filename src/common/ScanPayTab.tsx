import React, {useState} from "react";
import {Box} from "@mui/material";
import {toast} from "react-toastify";
import QRScanner from "./ScanCode";

interface Props {
    value: number;
    index: number;
    submitPay: (code: string) => Promise<void>;
}

function CustomTabPanel({children, value, index}: any) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

export default function ScanPayTab({value, index, submitPay}: Props) {

    const [isScanning, setIsScanning] = useState(true);

    return (
        <CustomTabPanel value={value} index={index}>
            <QRScanner
                onScanSuccess={(scannedCode: string) => {
                    if (!isScanning) return;

                    setIsScanning(false);

                    submitPay(scannedCode)
                        .catch(() => {
                            toast.error("支付失败");
                        })
                        .finally(() => {
                            // 防止连续触发
                            setTimeout(() => {
                                setIsScanning(true);
                            }, 1000);
                        });
                }}
                onScanLimitReached={() => {
                    toast.warning("扫描次数过多，请检查设备或刷新页面", {
                        position: "top-center",
                        autoClose: 5000
                    });
                }}
            />
        </CustomTabPanel>
    );
}