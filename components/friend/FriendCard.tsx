import React, { useState, useRef, useEffect, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ThumbsUp } from 'lucide-react';
import { FRIEND_LINKS } from '../../friends';
import { FRIEND_LEVELS, DISCONNECTED_LEVEL } from '../../consts/friendLevels';

interface FriendCardProps {
    link: typeof FRIEND_LINKS[0];
}

const StyledCard = styled.a`
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    background: ${props => props.theme.colors.bg};
    transition: all 0.3s ease;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    text-decoration: none;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @media (prefers-color-scheme: dark) {
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
    }
`;

const AvatarContainer = styled.div`
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
`;

const AvatarBorder = styled.div<{ $theme: string }>`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid ${props => props.$theme};
    opacity: 0.2;
    transform: scale(1.1);
`;

const Avatar = styled.img`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
    z-index: 10;
    transition: transform 0.5s ease;

    ${StyledCard}:hover & {
        transform: rotate(12deg);
    }
`;

const AvatarFallback = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${props => props.theme.colors.textGray3};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.bg};
    font-weight: bold;
    z-index: 10;
    position: relative;
`;

const ContentSection = styled.div`
    flex-grow: 1;
    min-width: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
`;

const Name = styled.h3`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RecommendedIcon = styled.div`
    position: relative;
    
    svg {
        color: #d3bc8e;
        fill: #d3bc8e;
        fill-opacity: 0.2;
        stroke-width: 3;
    }
`;

const Description = styled.p`
    font-size: 0.8125rem;
    color: ${props => props.theme.colors.textGray2};
    line-height: 1.4;
    margin-top: 0.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Stamp = styled.div<{ $color: string }>`
    position: absolute;
    bottom: -5px;
    right: -5px;
    opacity: 0.25;
    transition: all 0.3s ease;
    pointer-events: none;
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color};

    ${StyledCard}:hover & {
        opacity: 0.4;
        transform: scale(1.1) rotate(-12deg);
    }
`;

const StampTitle = styled.div`
    position: absolute;
    top: 20px;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.625rem;
    opacity: 1;
    font-family: serif;
`;

const StampDays = styled.div`
    position: absolute;
    bottom: 20px;
    font-family: monospace;
    font-size: 0.5625rem;
    opacity: 1;
    font-weight: bold;
`;

const BackgroundIcon = styled.div<{ $theme: string }>`
    position: absolute;
    top: 0;
    right: 0;
    padding: 2rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    color: ${props => props.$theme};

    ${StyledCard}:hover & {
        opacity: 0.05;
    }
`;

const FriendCard: React.FC<FriendCardProps> = ({ link }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);
    const theme = useContext(ThemeContext);

    // 计算已添加天数
    const getDaysAdded = () => {
        if (!link.addDate) return 0;
        const addDate = new Date(link.addDate);
        const today = new Date();
        const diffTime = today.getTime() - addDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const days = getDaysAdded();

    // 计算等级
    const getLevelInfo = () => {
        if (link.disconnected) return DISCONNECTED_LEVEL;
        if (days < 0) return null;
        
        const foundIndex = FRIEND_LEVELS.findIndex(l => days < l.days);
        if (foundIndex === -1) {
            return FRIEND_LEVELS[FRIEND_LEVELS.length - 1];
        }
        return FRIEND_LEVELS[foundIndex];
    };

    const levelInfo = getLevelInfo();

    useEffect(() => {
        if (!imgRef.current || shouldLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [shouldLoad]);

    // 转换主题颜色
    const getThemeColor = () => {
        if (!levelInfo) return theme?.colors?.textGray2 || '#666666';
        return levelInfo.color.includes('dark') 
            ? levelInfo.color.replace('dark:', '') 
            : levelInfo.color;
    };

    return (
        <StyledCard
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                borderColor: levelInfo ? undefined : theme?.colors?.uiLineGray2 || '#444444'
            }}
        >
            {levelInfo && (
                <>
                    <BackgroundIcon $theme={getThemeColor()}>
                        <levelInfo.Icon size={120} />
                    </BackgroundIcon>
                    <Stamp $color={getThemeColor()}>
                        <StampTitle>{levelInfo.title}</StampTitle>
                        <levelInfo.Icon size={40} strokeWidth={1.5} style={{ opacity: 0.6 }} />
                        <StampDays>{days} DAYS</StampDays>
                    </Stamp>
                </>
            )}

            <AvatarContainer ref={imgRef}>
                {levelInfo && (
                    <AvatarBorder $theme={getThemeColor()} />
                )}
                
                {!imageLoaded && !imageError && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: theme?.colors?.textGray3 || '#888888',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                )}

                {(!imageError && shouldLoad) ? (
                    <Avatar
                        src={link.avatar}
                        alt={link.name}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                        }}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                    />
                ) : imageError && (
                    <AvatarFallback>
                        {link.name.charAt(0)}
                    </AvatarFallback>
                )}
            </AvatarContainer>

            <ContentSection>
                <NameRow>
                    <Name>{link.name}</Name>
                    {link.recommended && (
                        <RecommendedIcon title="推荐">
                            <ThumbsUp size={14} />
                        </RecommendedIcon>
                    )}
                </NameRow>
                <Description>{link.description}</Description>
            </ContentSection>
        </StyledCard>
    );
};

export default FriendCard;
