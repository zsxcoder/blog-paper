import React, { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FRIEND_LINKS } from '../../friends';
import FriendCard from './FriendCard';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 5rem;
`;

const PageButton = styled.button<{ $disabled?: boolean; $active?: boolean }>`
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    color: ${props => props.theme.colors.textGray2};
    background: ${props => props.theme.colors.bg};
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
        background: ${props => props.theme.colors.uiLineGray2};
    }

    ${props => props.$disabled && `
        opacity: 0.5;
        cursor: not-allowed;
    `}

    ${props => props.$active && `
        background: ${props.theme.colors.accent};
        color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: scale(1.1);
    `}
`;

const PageNumbers = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
`;

const PageNumber = styled.button<{ $active?: boolean }>`
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    background: transparent;
    color: ${props => props.theme.colors.textGray};

    &:hover {
        background: ${props => props.theme.colors.uiLineGray2};
    }

    ${props => props.$active && `
        background: ${props.theme.colors.accent};
        color: white;
        font-weight: 600;
    `}
`;

interface FriendsListProps {
    links: typeof FRIEND_LINKS;
    pageSize?: number;
}

const FriendsList: React.FC<FriendsListProps> = ({ links, pageSize = 12 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const activeLinks = links.filter(link => !link.disconnected);
    const totalPages = Math.ceil(activeLinks.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentLinks = activeLinks.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Grid>
                {currentLinks.map((link) => (
                    <FriendCard key={link.url} link={link} />
                ))}
            </Grid>

            {totalPages > 1 && (
                <PaginationContainer>
                    <PageButton
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                    </PageButton>

                    <PageNumbers>
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1;
                            return (
                                <PageNumber
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    $active={currentPage === page}
                                >
                                    {page}
                                </PageNumber>
                            );
                        })}
                    </PageNumbers>

                    <PageButton
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={20} />
                    </PageButton>
                </PaginationContainer>
            )}
        </>
    );
};

export default FriendsList;
