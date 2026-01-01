// ============================================
// 友链等级配置
// ============================================

import {
    Sparkles, Sprout, Leaf, Flower,
    Feather, Wind, Cloud, Droplets,
    Snowflake, Mountain, Shield, Flame,
    Sun, Zap, Crown, Ghost
} from 'lucide-react';

export const DISCONNECTED_LEVEL = {
    days: 0,
    level: 0,
    title: '失联',
    Icon: Ghost,
    theme: 'text-[#80ff00]',
    color: '#80ff00',
    border: 'border-[#80ff00] dark:border-white/10 hover:border-[#80ff00] dark:hover:border-white/20'
};

// 15级友链等级配置 - 全部使用草绿色 #80ff00
export const FRIEND_LEVELS = [
    {
        days: 30, level: 1, title: '初遇', Icon: Sparkles,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 60, level: 2, title: '萌芽', Icon: Sprout,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 90, level: 3, title: '抽叶', Icon: Leaf,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 180, level: 4, title: '绽放', Icon: Flower,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 270, level: 5, title: '轻语', Icon: Feather,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 365, level: 6, title: '听风', Icon: Wind,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 450, level: 7, title: '云游', Icon: Cloud,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 540, level: 8, title: '润泽', Icon: Droplets,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 630, level: 9, title: '凝冰', Icon: Snowflake,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 730, level: 10, title: '磐石', Icon: Mountain,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 900, level: 11, title: '坚守', Icon: Shield,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 1080, level: 12, title: '燃情', Icon: Flame,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 1460, level: 13, title: '烈阳', Icon: Sun,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 1825, level: 14, title: '雷鸣', Icon: Zap,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
    {
        days: 2190, level: 15, title: '传世', Icon: Crown,
        theme: 'text-[#80ff00]',
        border: 'border-[#80ff00] group-hover:border-[#80ff00]',
        color: '#80ff00'
    },
];
