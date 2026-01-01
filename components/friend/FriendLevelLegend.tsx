import React, { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { FRIEND_LEVELS } from '../../consts/friendLevels';

const Container = styled.div`
    width: 100%;
    background: ${props => props.theme.colors.bg};
    border-radius: 0.75rem;
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    overflow: hidden;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
`;

const Header = styled.button`
    width: 100%;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    transition: background 0.2s ease;

    &:hover {
        background: ${props => props.theme.colors.uiLineGray2};
    }
`;

const Title = styled.h3`
    font-size: 1.125rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
`;

const Content = styled.div<{ $expanded: boolean }>`
    display: grid;
    grid-template-rows: ${props => props.$expanded ? '1fr' : '0fr'};
    transition: grid-template-rows 0.3s ease;
    opacity: ${props => props.$expanded ? 1 : 0};

    & > div {
        overflow: hidden;
    }
`;

const InnerContent = styled.div<{ $expanded: boolean }>`
    padding: ${props => props.$expanded ? '1.5rem 1.5rem 1rem 1.5rem' : '0'};
    border-top: ${props => props.$expanded ? `1px solid ${props.theme.colors.uiLineGray2}` : 'none'};
`;

const LevelGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;

const LevelItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: background 0.2s ease;
    cursor: default;

    &:hover {
        background: ${props => props.theme.colors.uiLineGray2};
    }
`;

const LevelIconWrapper = styled.div<{ $theme: string }>`
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.colors.uiLineGray2};
    color: ${props => props.$theme};
    flex-shrink: 0;
`;

const LevelText = styled.div`
    display: flex;
    flex-direction: column;
    cursor: default;
`;

const LevelName = styled.span<{ $theme: string }>`
    font-size: 0.75rem;
    font-weight: bold;
    color: ${props => props.$theme};
    cursor: default;
`;

const LevelDays = styled.span`
    font-size: 0.625rem;
    color: ${props => props.theme.colors.textGray2};
    cursor: default;
`;

const FriendLevelLegend: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const theme = useContext(ThemeContext);

    const getThemeColor = (color: string) => {
        return color.includes('dark') 
            ? color.replace('dark:', '') 
            : color;
    };

    return (
        <Container>
            <Header onClick={() => setIsExpanded(!isExpanded)}>
                <Title>
                    <Info size={20} style={{ color: theme?.colors?.textGray2 || '#666666' }} />
                    友链印记说明
                </Title>
                <div style={{ color: theme?.colors?.textGray2 || '#666666' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </Header>

            <Content $expanded={isExpanded}>
                <InnerContent $expanded={isExpanded}>
                    <LevelGrid>
                        {FRIEND_LEVELS.map((level, index) => {
                            const prevLevel = FRIEND_LEVELS[index - 1];
                            const prevDays = prevLevel ? prevLevel.days + 1 : 0;
                            const isLast = index === FRIEND_LEVELS.length - 1;
                            const dayRange = isLast ? `${level.days}天+` : `${prevDays}-${level.days}天`;

                            return (
                                <LevelItem key={level.level}>
                                    <LevelIconWrapper $theme={getThemeColor(level.theme)}>
                                        <level.Icon size={16} />
                                    </LevelIconWrapper>
                                    <LevelText>
                                        <LevelName $theme={getThemeColor(level.theme)}>
                                            {level.title}
                                        </LevelName>
                                        <LevelDays>{dayRange}</LevelDays>
                                    </LevelText>
                                </LevelItem>
                            );
                        })}
                    </LevelGrid>
                </InnerContent>
            </Content>
        </Container>
    );
};

export default FriendLevelLegend;
