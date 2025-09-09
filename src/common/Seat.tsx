import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface SeatConfig {
    name: string;
    status: number;
    id: string;
    type: string;
    background: string;
    rate: string;
}

type MySeatProps = {
    storeId: string; // 接受 storeId 作为参数
    onSelectSeat?: (seatId: string) => void; // 座位选择的回调函数
};

export default function MySeat({ storeId, onSelectSeat }: MySeatProps) {
    const [selectedSeatId, setSelectedSeatId] = useState<string>('');
    const [data, setData] = useState<SeatConfig[]>([]);

    useEffect(() => {
        // 从 localStorage 初始化已选座位
        const savedSelection = localStorage.getItem('selectedSeatId');
        if (savedSelection) setSelectedSeatId(savedSelection);

        // 获取数据
        if (storeId) {
            fetchData(storeId);
        }
    }, [storeId]);

    const handleSelect = (item: SeatConfig) => {
        if (item.status === 0) {
            localStorage.setItem('selectedSeatId', item.id);
            setSelectedSeatId(item.id);

            // 回调父组件
            if (onSelectSeat) {
                onSelectSeat(item.id);
            }
        }
    };

    const fetchData = async (storeId: string) => {
        try {
            const Cookie = localStorage.getItem('cookie') || '';
            const response = await axios.get<SeatConfig[]>(
                `/v1/hlj/store/seat/${storeId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Cookies: Cookie,
                    },
                }
            );

            if (response.status === 200) {
                const seatList = response.data.map((item) => ({
                    ...item,
                    background: item.background.startsWith('http')
                        ? item.background
                        : `${window.location.origin}${item.background}`,
                }));
                setData(seatList);
            } else if (response.status === 401) {
                window.location.href = '/login';
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.error('Unauthorized access - redirecting to login');
                window.location.href = '/login';
            } else {
                console.error('Error fetching data:', error);
            }
        }
    };

    return (
        <ImageList
            sx={{ width: 900, height: 1800 }}
            cols={6}
            rowHeight={120}
            variant="standard"
        >
            {data.map((item) => (
                <ImageListItem
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    sx={{
                        cursor: item.status === 0 ? 'pointer' : 'not-allowed',
                        position: 'relative',
                        opacity: item.status === 3 ? 0.5 : 1,
                        ...(selectedSeatId === item.id && {
                            border: '3px solid limegreen',
                            borderRadius: '5px',
                        }),
                        ...(item.status === 1 && { border: '3px solid orange' }),
                        ...(item.status === 2 && { border: '3px solid crimson' }),
                        ...(item.status === 3 && { border: '3px solid darkgray' }),
                    }}
                >
                    <img
                        srcSet={`${item.background}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={item.background}
                        alt={item.name}
                        loading="lazy"
                        style={{
                            filter: item.status === 3 ? 'grayscale(100%)' : 'none',
                        }}
                    />
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: -5,
                            left: 0,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                        variant="caption"
                    >
                        {`${item.name}`}
                    </Typography>
                    <Typography
                        sx={{
                            position: 'absolute',
                            bottom: -3,
                            right: 0,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                        variant="caption"
                    >
                        {`${item.id}`}
                    </Typography>
                    {selectedSeatId === item.id && item.status === 0 && (
                        <CheckCircleIcon
                            sx={{
                                color: 'limegreen',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: 48,
                            }}
                        />
                    )}
                </ImageListItem>
            ))}
        </ImageList>
    );
}