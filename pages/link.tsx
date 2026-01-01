import Head from 'next/head';
import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { CommonHead } from '.';
import { FRIEND_LINKS } from '../friends';
import { siteInfo } from '../site.config';
import Topbar from '../components/page/topbar';
import LayoutContainer from '../components/layout';
import FriendLevelLegend from '../components/friend/FriendLevelLegend';
import FriendsList from '../components/friend/FriendsList';
import DisconnectedFriendsList from '../components/friend/DisconnectedFriendsList';
import SiteInfo from '../components/friend/SiteInfo';
import Waline from '../components/page/waline';
import { useTranslation } from 'react-i18next';
import { bottomFadeIn } from '../styles/animations';

const StyledLayout = styled(LayoutContainer)`
    background: ${props => props.theme.colors.bg2};
    overflow-x: hidden;
`;

const Main = styled.main`
    animation: ${bottomFadeIn} 0.5s ease;
    width: 100%;
`;

const Container = styled.div`
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px 48px 20px;

    @media (max-width: 768px) {
        padding: 0 16px 36px 16px;
    }
`;

const HeroSection = styled.div`
    text-align: center;
    margin-bottom: 3rem;
    padding-top: 1rem;

    @media (max-width: 768px) {
        margin-bottom: 2rem;
    }
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.75rem;
    font-family: serif;

    @media (min-width: 768px) {
        font-size: 2.5rem;
    }
`;

const Subtitle = styled.p`
    font-size: 1.125rem;
    color: ${props => props.theme.colors.textGray2};
    font-style: italic;
    font-family: serif;
    margin: 0;
`;

const InfoSection = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 3rem;
    width: 100%;
    box-sizing: border-box;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
`;

const ApplyCard = styled.div`
    border-radius: 1rem;
    background: ${props => props.theme.colors.bg};
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    padding: 1.5rem;
    width: 100%;
    min-width: 0;
    word-break: break-word;
    box-sizing: border-box;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 1.25rem;
        margin-bottom: 1rem;
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
    box-sizing: border-box;
`;

const CardTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const CardContent = styled.p`
    font-size: 0.875rem;
    color: ${props => props.theme.colors.textGray2};
    margin: 0 0 0.75rem 0;
    line-height: 1.6;
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
`;

const EmailLink = styled.a`
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
        text-decoration: underline;
        opacity: 0.8;
    }
    
    word-break: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    display: inline-block;
`;

const TipBox = styled.div`
    border-radius: 0.75rem;
    border: 2px dashed;
    border-color: ${props => props.theme.colors.accent}40;
    background: ${props => props.theme.colors.accent}10;
    padding: 1rem;
    text-align: center;
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
`;

const TipTitle = styled.p`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.colors.accent};
    margin: 0 0 0.25rem 0;
    word-break: break-word;
`;

const TipDesc = styled.p`
    font-size: 0.75rem;
    color: ${props => props.theme.colors.textGray2};
    margin: 0;
    word-break: break-word;
`;

const IconWrapper = styled.div<{ $color: string }>`
    color: ${props => props.$color};
`;

const SiteInfoWrapper = styled.div`
    width: 100%;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
    
    > div {
        width: 100% !important;
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-word;
        box-sizing: border-box !important;
    }
    
    h3, code, span, p, div {
        box-sizing: border-box;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    code {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
    }
`;

export default function Link() {
    const theme = useContext(ThemeContext);
    const { t } = useTranslation();

    // 本站信息
    const siteInfoForFriend = {
        name: siteInfo.author,
        url: siteInfo.domain,
        description: '记录一些思考和吐槽',
        avatar: siteInfo.avatar
    };

    return (
        <>
            <Head>
                <title>{`友情链接 | ${siteInfo.author}`}</title>
                <CommonHead />
            </Head>
            
            <StyledLayout hidesearch={true}>
                <Main>
                    <Container>
                        <HeroSection>
                            <Title>友情链接</Title>
                            <Subtitle>探索更多优秀的内容创作者和技术伙伴。</Subtitle>
                        </HeroSection>

                        <FriendLevelLegend />
                        <FriendsList links={FRIEND_LINKS} />
                        <DisconnectedFriendsList links={FRIEND_LINKS} />

                        <InfoSection>
                            <ApplyCard>
                                <CardHeader>
                                    <IconWrapper $color={theme?.colors?.accent || '#666666'}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </IconWrapper>
                                    <CardTitle>申请友链</CardTitle>
                                </CardHeader>
                                <CardContent>欢迎技术与生活类博客交换友链</CardContent>
                                <CardContent>
                                    请发送邮件至 <EmailLink href={`mailto:${siteInfo.social.email}`}>
                                        {siteInfo.social.email}
                                    </EmailLink>
                                </CardContent>
                                <TipBox>
                                    <TipTitle>博客名称、描述、地址、头像等信息</TipTitle>
                                    <TipDesc>任意格式均可，包含基本信息即可</TipDesc>
                                </TipBox>
                            </ApplyCard>

                            <SiteInfoWrapper>
                                <SiteInfo
                                    name={siteInfoForFriend.name}
                                    url={siteInfoForFriend.url}
                                    description={siteInfoForFriend.description}
                                    avatar={siteInfoForFriend.avatar}
                                />
                            </SiteInfoWrapper>
                        </InfoSection>
                        
                        <Waline />
                    </Container>
                </Main>
            </StyledLayout>
        </>
    );
}