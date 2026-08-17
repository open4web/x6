import React, {useState} from "react";
import {Box} from "@mui/material";
import {toast} from "react-toastify";
import {tPos} from "../i18n/t";
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
                            toast.error(tPos('pay.failed'));
                        })
                        .finally(() => {
                            // 防止连续触发
                            setTimeout(() => {
                                setIsScanning(true);
                            }, 1000);
                        });
                }}
                onScanLimitReached={() => {
                    toast.warning(tPos('pay.scan_limit'), {
                        position: "top-center",
                        autoClose: 5000
                    });
                }}
            />
        </CustomTabPanel>
    );
}