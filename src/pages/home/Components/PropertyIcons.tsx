import * as React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import OpacityIcon from '@mui/icons-material/Opacity';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EggAltIcon from '@mui/icons-material/EggAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CakeIcon from '@mui/icons-material/Cake';

export const PROPERTY_ICONS = [
    { id: 'sugar', name: '糖份', color: '#c47b17', Icon: OpacityIcon },
    { id: 'size', name: '份量', color: '#1976d2', Icon: LunchDiningIcon },
    { id: 'spicy', name: '辣度', color: '#d32f2f', Icon: LocalFireDepartmentIcon },
    { id: 'temperature', name: '冷热', color: '#ed6c02', Icon: DeviceThermostatIcon },
    { id: 'ice', name: '冰量', color: '#0288d1', Icon: AcUnitIcon },
    { id: 'sweet', name: '甜度', color: '#8e24aa', Icon: CakeIcon },
    { id: 'cook', name: '做法', color: '#5d4037', Icon: RestaurantIcon },
    { id: 'addon', name: '加料', color: '#2e7d32', Icon: EggAltIcon },
    { id: 'other', name: '其他', color: '#616161', Icon: MoreHorizIcon },
];

export const getPropertyIcon = (id?: string) => PROPERTY_ICONS.find(item => item.id === id);

export const PropertyIconView = ({
    icon,
    size = 22,
}: {
    icon?: string;
    size?: number;
}) => {
    const item = getPropertyIcon(icon);
    const Icon = item?.Icon || TuneIcon;
    return <Icon sx={{ fontSize: size, color: item?.color || 'action.active' }} />;
};
