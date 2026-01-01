import React, { useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Copy, Check } from 'lucide-react';

interface SiteInfoProps {
    name: string;
    url: string;
    description: string;
    avatar: string;
}

const Card = styled.div`
    border-radius: 1rem;
    background: ${props => props.theme.colors.bg};
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div<{ $color: string }>`
    color: ${props => props.$color};
`;

const Title = styled.h3`
    font-size: 1.125rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin: 0;
`;

const JSONButton = styled.button<{ $copied: boolean }>`
    margin-left: auto;
    padding: 0.25rem 0.5rem;
    background: ${props => props.$copied ? props.theme.colors.accent + '20' : props.theme.colors.uiLineGray2};
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: ${props => props.$copied ? props.theme.colors.accent : props.theme.colors.textGray2};
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    &:hover {
        background: ${props => props.theme.colors.uiLineGray2};
        color: ${props => props.theme.colors.text};
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s ease;

    &:hover {
        background: ${props => props.theme.colors.uiLineGray2};
    }
`;

const Label = styled.span`
    font-size: 0.8125rem;
    color: ${props => props.theme.colors.textGray2};
    width: 3.5rem;
    flex-shrink: 0;
`;

const Value = styled.code`
    font-size: 0.8125rem;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const CopyIconButton = styled.button<{ $copied: boolean }>`
    margin-left: 0.5rem;
    padding: 0.25rem;
    background: transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    color: ${props => props.$copied ? props.theme.colors.accent : props.theme.colors.textGray2};
    opacity: 0;
    transition: all 0.2s ease;
    border: none;

    ${InfoRow}:hover & {
        opacity: 1;
    }

    ${props => props.$copied && `
        opacity: 1 !important;
        background: ${props.theme.colors.accent}20;
    `}

    &:hover {
        color: ${props => props.theme.colors.accent};
    }
`;

const SiteInfo: React.FC<SiteInfoProps> = ({ name, url, description, avatar }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleCopyJSON = () => {
        const data = {
            name,
            url,
            description,
            avatar
        };
        handleCopy(JSON.stringify(data, null, 2), 'json');
    };

    return (
        <Card>
            <Header>
                <IconWrapper $color="#1e40af">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </IconWrapper>
                <Title>本站信息</Title>
                <JSONButton $copied={copiedField === 'json'} onClick={handleCopyJSON}>
                    {copiedField === 'json' ? '已复制' : 'JSON'}
                </JSONButton>
            </Header>

            <InfoContainer>
                <InfoRow>
                    <Label>名称</Label>
                    <Value>{name}</Value>
                    <CopyIconButton $copied={copiedField === 'name'} onClick={() => handleCopy(name, 'name')}>
                        {copiedField === 'name' ? <Check size={14} /> : <Copy size={14} />}
                    </CopyIconButton>
                </InfoRow>
                <InfoRow>
                    <Label>地址</Label>
                    <Value>{url}</Value>
                    <CopyIconButton $copied={copiedField === 'url'} onClick={() => handleCopy(url, 'url')}>
                        {copiedField === 'url' ? <Check size={14} /> : <Copy size={14} />}
                    </CopyIconButton>
                </InfoRow>
                <InfoRow>
                    <Label>描述</Label>
                    <Value>{description}</Value>
                    <CopyIconButton $copied={copiedField === 'description'} onClick={() => handleCopy(description, 'description')}>
                        {copiedField === 'description' ? <Check size={14} /> : <Copy size={14} />}
                    </CopyIconButton>
                </InfoRow>
                <InfoRow>
                    <Label>头像</Label>
                    <Value>{avatar}</Value>
                    <CopyIconButton $copied={copiedField === 'avatar'} onClick={() => handleCopy(avatar, 'avatar')}>
                        {copiedField === 'avatar' ? <Check size={14} /> : <Copy size={14} />}
                    </CopyIconButton>
                </InfoRow>
            </InfoContainer>
        </Card>
    );
};

export default SiteInfo;
