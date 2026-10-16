import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Input, Tag} from 'antd';
import {useTranslate} from 'react-admin';
import {Assignee, filterAssignees} from './types';

type AdminMentionProps = {
    people: Assignee[];
    value?: string;
    onChange?: (id: string) => void;
    excludeIds?: string[];
    placeholder?: string;
    disabled?: boolean;
};

const roleColor: Record<string, string> = {
    owner: 'purple',
    admin: 'blue',
    staff: 'default',
};

const roleMessage = (role: string) => {
    if (role === 'owner') {
        return 'pos.login.role_owner';
    }
    if (role === 'admin') {
        return 'pos.login.role_admin';
    }
    return 'pos.login.role_user';
};

const initials = (name: string) => (name || '?').trim().slice(0, 1);

const PersonFace: React.FC<{person: Assignee; size?: number}> = ({person, size = 36}) => {
    const face = (
        <Avatar size={size} src={person.avatar || undefined} style={{background: '#0f172a', flex: '0 0 auto'}}>
            {initials(person.name)}
        </Avatar>
    );
    if (!person.online) {
        return face;
    }
    return (
        <span style={{position: 'relative', display: 'inline-flex'}}>
            {face}
            <span
                style={{
                    position: 'absolute',
                    right: -1,
                    bottom: -1,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '2px solid #fff',
                }}
            />
        </span>
    );
};

const AdminMention = React.forwardRef<HTMLInputElement, AdminMentionProps>(({
    people,
    value,
    onChange,
    excludeIds = [],
    placeholder,
    disabled,
}, ref) => {
    const translate = useTranslate();
    const selected = people.find(person => person.id === value);
    const [query, setQuery] = useState(selected?.name || '');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (selected) {
            setQuery(selected.name);
        }
    }, [selected?.id, selected?.name]);

    const filtered = useMemo(
        () => filterAssignees(people, query, excludeIds),
        [people, query, excludeIds],
    );

    useEffect(() => {
        setActive(0);
    }, [query, open]);

    const pick = (person: Assignee) => {
        onChange?.(person.id);
        setQuery(person.name);
        setOpen(false);
    };

    const roleText = (person: Assignee) => translate(roleMessage(person.role));
    const extra = (person: Assignee) => {
        const bits: string[] = [];
        if (person.category) {
            bits.push(person.category);
        }
        if (person.titles?.length) {
            bits.push(person.titles.slice(0, 2).join(' / '));
        }
        if (person.phone_suffix) {
            bits.push(translate('pos.handover.phone_tail', {suffix: person.phone_suffix, _: `····${person.phone_suffix}`}));
        }
        if (person.online) {
            bits.push(translate('pos.handover.online', {_: 'Online'}));
        }
        return bits.join(' · ');
    };

    return (
        <div style={{position: 'relative', width: '100%'}}>
            <Input
                ref={ref as React.Ref<any>}
                prefix={<span style={{color: '#1677ff', fontWeight: 700}}>@</span>}
                value={query}
                disabled={disabled}
                allowClear
                placeholder={placeholder}
                autoComplete="off"
                onFocus={() => setOpen(true)}
                onChange={event => {
                    const next = event.target.value.replace(/^@+/g, '');
                    setQuery(next);
                    setOpen(true);
                    if (!selected || selected.name !== next) {
                        onChange?.('');
                    }
                }}
                onBlur={() => {
                    window.setTimeout(() => {
                        const exact = filterAssignees(people, query, excludeIds)
                            .filter(person => person.name.toLowerCase() === query.trim().toLowerCase());
                        if (exact.length === 1) {
                            pick(exact[0]);
                            return;
                        }
                        setOpen(false);
                        setQuery(selected?.name || '');
                    }, 120);
                }}
                onKeyDown={event => {
                    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                        setOpen(true);
                        return;
                    }
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setActive(index => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        setActive(index => Math.max(index - 1, 0));
                    } else if (event.key === 'Escape') {
                        setOpen(false);
                    } else if (event.key === 'Enter' && open) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (filtered[active]) {
                            pick(filtered[active]);
                        }
                    }
                }}
            />
            {open && !disabled && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 30,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 10,
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                        maxHeight: 280,
                        overflow: 'auto',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div style={{padding: '12px 14px', color: '#64748b'}}>
                            {translate('pos.handover.mention_empty', {_: 'No administrator matches this prefix'})}
                        </div>
                    ) : filtered.map((person, index) => (
                        <button
                            key={person.id}
                            type="button"
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => pick(person)}
                            onMouseEnter={() => setActive(index)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                textAlign: 'left',
                                border: 0,
                                cursor: 'pointer',
                                padding: '8px 10px',
                                background: index === active ? '#e0f2fe' : 'transparent',
                            }}
                        >
                            <PersonFace person={person} />
                            <span style={{minWidth: 0}}>
                                <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                                    <strong>{person.name}</strong>
                                    <Tag color={roleColor[person.role] || 'default'} style={{marginInlineEnd: 0}}>
                                        {roleText(person)}
                                    </Tag>
                                </span>
                                {extra(person) && (
                                    <span style={{display: 'block', color: '#64748b', fontSize: 12}}>{extra(person)}</span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            )}
            {selected && (
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
                    <PersonFace person={selected} size={28} />
                    <span style={{fontWeight: 600}}>@{selected.name}</span>
                    <Tag color={roleColor[selected.role] || 'default'}>{roleText(selected)}</Tag>
                    {selected.phone_suffix && (
                        <span style={{color: '#64748b', fontSize: 12}}>
                            {translate('pos.handover.phone_tail', {suffix: selected.phone_suffix, _: `····${selected.phone_suffix}`})}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
});

AdminMention.displayName = 'AdminMention';

export default AdminMention;
