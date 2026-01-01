import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Ghost } from 'lucide-react';
import { FRIEND_LINKS } from '../../friends';

const Container = styled.div`
    margin-bottom: 5rem;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const Title = styled.h3`
    font-size: 1.125rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin: 0;
`;

const Description = styled.p`
    font-size: 0.875rem;
    color: ${props => props.theme.colors.textGray2};
    margin: 0 0 1rem 0;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const DisconnectedCard = styled.a`
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px dashed ${props => props.theme.colors.uiLineGray2};
    background: ${props => props.theme.colors.bg};
    opacity: 0.6;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
        opacity: 1;
        border-style: solid;
        transform: translateY(-2px);
    }
`;

const Avatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    opacity: 0.7;
`;

const Content = styled.div`
    flex: 1;
    min-width: 0;
`;

const Name = styled.h4`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin: 0 0 0.25rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LinkText = styled.span`
    font-size: 0.75rem;
    color: ${props => props.theme.colors.textGray2};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

interface DisconnectedFriendsListProps {
    links: typeof FRIEND_LINKS;
}

const DisconnectedFriendsList: React.FC<DisconnectedFriendsListProps> = ({ links }) => {
    const theme = useContext(ThemeContext);
    const disconnectedLinks = links.filter(link => link.disconnected);

    if (disconnectedLinks.length === 0) return null;

    return (
        <Container>
            <Header>
                <Ghost size={20} style={{ color: theme?.colors?.textGray2 || '#666666' }} />
                <Title>失联友链</Title>
            </Header>
            <Description>这些站点暂时无法访问，但我会定期检查，期待它们的回归。</Description>
            <Grid>
                {disconnectedLinks.map((link) => (
                    <DisconnectedCard key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                        <Avatar src={link.avatar} alt={link.name} />
                        <Content>
                            <Name>{link.name}</Name>
                            <LinkText>{link.url}</LinkText>
                        </Content>
                    </DisconnectedCard>
                ))}
            </Grid>
        </Container>
    );
};

export default DisconnectedFriendsList;
