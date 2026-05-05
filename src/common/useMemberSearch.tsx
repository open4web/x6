// hooks/useMemberSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

interface MemberProps {
    id: string;
    name: string;
    phone: string;
    balance: number;
    // 其他字段...
}

export function useMemberSearch(fetchData: any) {
    const [phoneSuffix, setPhoneSuffix] = useState('');
    const [memberList, setMemberList] = useState<MemberProps[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMemberList = useCallback(async (suffix: string) => {
        if (suffix.length !== 4) {
            setMemberList([]);
            return;
        }

        setLoading(true);
        try {
            await fetchData('/v1/hlj/member/account/search', (res: any) => {
                setMemberList(res || []);
            }, 'GET', { suffix });
        } catch (err) {
            toast.error('会员查询失败');
            setMemberList([]);
        } finally {
            setLoading(false);
        }
    }, [fetchData]);

    // 防抖查询
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMemberList(phoneSuffix);
        }, 300);

        return () => clearTimeout(timer);
    }, [phoneSuffix, fetchMemberList]);

    return {
        phoneSuffix,
        setPhoneSuffix,
        memberList,
        loading,
        fetchMemberList,
    };
}