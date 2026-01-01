import { MenuSquare, RefreshCw, Users, X } from "lucide-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { ThemeContext } from "styled-components";
import ButtonFloat from "../../components/common/button-float";
import Modal from "../../components/common/modal";
import { TwoColLayout } from "../../components/layout";
import { PageDescription } from "../../components/common/page-description";
import { LinkWithLine } from "../../components/common/link-with-line";
import Footer from "../../components/page/footer";
import Topbar from "../../components/page/topbar";
import CardCommon from "../../components/memo/cardcommon";
import CommentCard from "../../components/memo/commentcard";
import { MastodonStatus, MastodonConfig, MastodonMedia } from "../../lib/data/mastodon.common";
import { siteInfo } from "../../site.config";
import { FRIEND_LINKS } from "../../friends";
import { fadeInRight, bottomFadeIn } from "../../styles/animations";
import { dropShadow, floatMenu } from "../../styles/css";
import { MarkdownStyle } from "../../components/markdown/markdown-style";

const Waline = dynamic(() => import("../../components/page/waline"))

export default function Mastodon() {
  const theme = useContext(ThemeContext)
  const [isMobileSider, setIsMobileSider] = useState(false)
  const [t] = useTranslation()
  const [postsData, setpostsData] = useState<MastodonStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<MastodonMedia[] | null>(null)
  const [isCommentModal, setIsCommentModal] = useState(false)

  // Random friends - show 5 random friends
  const [randomFriends, setRandomFriends] = useState<Array<{ name: string, link: string }>>([])

  // Initialize random friends
  const initializeRandomFriends = () => {
    const allFriends = FRIEND_LINKS.map(link => ({ name: link.name, link: link.url }))
    const shuffled = [...allFriends].sort(() => 0.5 - Math.random())
    setRandomFriends(shuffled.slice(0, 5))
  }

  // Initialize on mount
  useEffect(() => {
    initializeRandomFriends()
  }, [])

  // Config from environment variables
  const config: Omit<MastodonConfig, 'token'> = useMemo(() => ({
    instance: process.env.NEXT_PUBLIC_MASTODON_INSTANCE || '',
    userId: process.env.NEXT_PUBLIC_MASTODON_USER_ID || '',
    tag: process.env.NEXT_PUBLIC_MASTODON_TAG || undefined,
    shownMax: parseInt(process.env.NEXT_PUBLIC_MASTODON_SHOWN_MAX || '20'),
  }), [])

  // Fetch statuses from Mastodon API
  const fetchStatuses = useCallback(async (maxId?: string) => {
    if (!config.instance || !config.userId) {
      setError('Mastodon configuration is missing. Please check .env.local')
      setLoading(false)
      return
    }

    try {
      const tagParam = config.tag ? `&tagged=${config.tag}` : ''
      const maxIdParam = maxId ? `&max_id=${maxId}` : ''
      const path = `https://${config.instance}/api/v1/accounts/${config.userId}/statuses?exclude_replies=true${tagParam}${maxIdParam}`

      const headers: Record<string, string> = {}
      const token = process.env.NEXT_PUBLIC_MASTODON_TOKEN
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(path, { headers })

      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: MastodonStatus[] = await response.json()
      const filtered = data.slice(0, config.shownMax || data.length)

      if (maxId) {
        setpostsData(prev => [...prev, ...filtered])
      } else {
        setpostsData(filtered)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [config])

  // Initial fetch
  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  // Load more statuses
  const handleLoadMore = useCallback(() => {
    const lastId = postsData[postsData.length - 1]?.id
    if (!lastId) return

    setLoading(true)
    setError(null)
    fetchStatuses(lastId)
  }, [postsData, fetchStatuses])

  // Handle image click
  const handleShowImage = useCallback((images: MastodonMedia[]) => {
    setSelectedImages(images)
  }, [])

  const handleCloseImages = useCallback(() => {
    setSelectedImages(null)
  }, [])

  return (
    <>
      <Head>
        <title>{`${siteInfo.author} - Mastodon`}</title>
        <meta name="description" content="A personal blog about work and life" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar
        placeHolder={false}
        hideSearch={true}
        style={{ borderBottom: "1px solid " + theme?.colors.uiLineGray2 }}
      />
      <main style={{
        background: theme?.colors.bg2
      }}>
        <OneColLayout>
          <ButtonFloat
            className="button-float"
            Icon={MenuSquare}
            clickHandler={(e) => setIsMobileSider(v => !v)}
          />
          <TwoColLayout
            sep={1}
            siderLocation="right"
          >
            <Col>
              <PageDescription style={{ marginRight: "1rem" }}>
                Mastodon Statuses: {postsData.length}
              </PageDescription>
              <MastodonColContainer style={{ marginTop: "0.625rem" }}>
                {loading && postsData.length === 0 && <LoadingWrapper><span>Loading...</span></LoadingWrapper>}
                {error && <ErrorWrapper>Error: {error}</ErrorWrapper>}
                {!loading && !error && postsData.length === 0 && <EmptyWrapper>No statuses found</EmptyWrapper>}
                {postsData.map(status => (
                  <MastodonStatusCard
                    key={status.id}
                    status={status}
                    onShowImage={handleShowImage}
                  />
                ))}
                {!loading && !error && postsData.length > 0 && (
                  <LoadMoreButton onClick={handleLoadMore}>
                    Load More
                  </LoadMoreButton>
                )}
              </MastodonColContainer>
              <Footer style={{ marginTop: "5rem" }} />
            </Col>
            <SiderContent $isMobileSider={isMobileSider}>
              <div className="close-btn" onClick={(e) => { e.stopPropagation(); setIsMobileSider(v => !v) }}>
                小小のメニュー<X size={"1.25em"} style={{ marginLeft: ".5rem" }} />
              </div>
              <NavCard>
                <h3>Mastodon Info</h3>
                <p>Instance: {config.instance || 'Not configured'}</p>
                <p>Max shown: {config.shownMax || 'All'}</p>
                {config.tag && <p>Tag: #{config.tag}</p>}
              </NavCard>
              {randomFriends.length > 0
                && <CardCommon
                  title={t("friends")}
                  Icon={Users}
                  extra={
                    <RefreshButton onClick={initializeRandomFriends} title="刷新友链">
                      <RefreshCw size={14} />
                    </RefreshButton>
                  }
                >
                  {randomFriends.map((f, i) => <FriendLink key={i} href={f.link}>{f.name}</FriendLink>)}
                  <MoreLink href="/link">更多…</MoreLink>
                </CardCommon>
              }
              {siteInfo.walineApi && siteInfo.walineApi !== "" && <CommentCard setIsCommentModal={setIsCommentModal} />}
            </SiderContent>
          </TwoColLayout>
        </OneColLayout>
        {selectedImages && (
          <ImageModal
            isModal={!!selectedImages}
            setModal={handleCloseImages}
            style={{ background: "transparent" }}
            isAnimated={true}
            showCloseBtn={true}>
            <ImageContainer>
              {selectedImages.map((img, idx) => (
                <ImageWrapper key={idx}>
                  <a href={img.url} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={img.preview_url}
                      alt={`Attachment ${idx + 1}`}
                      width={800}
                      height={600}
                      unoptimized
                    />
                  </a>
                </ImageWrapper>
              ))}
            </ImageContainer>
          </ImageModal>
        )}
        {siteInfo.walineApi && siteInfo.walineApi !== "" &&
          <Modal
            isModal={isCommentModal}
            setModal={setIsCommentModal}
            style={{ background: "transparent" }}
            isAnimated={true}
            showCloseBtn={true}>
            <CommentContainer>
              <Waline onClick={e => e.stopPropagation()} />
            </CommentContainer>
          </Modal>
        }
      </main>
    </>
  )
}

// Helper component for Mastodon status card
function MastodonStatusCard({ status, onShowImage }: { status: MastodonStatus, onShowImage: (images: MastodonMedia[]) => void }) {
  const theme = useContext(ThemeContext)
  const displayStatus = status.reblog || status
  const isReblog = !!status.reblog
  const isReply = !!displayStatus.in_reply_to_id

  // Format content with emojis
  const formatContent = (content: string, emojis: MastodonStatus['emojis']) => {
    return content.replace(/:(\w+):/g, (match, p1) => {
      const emoji = emojis.find(e => e.shortcode === p1)
      return emoji ? `<img class="emoji" src="${emoji.static_url}" alt="${p1}" />` : match
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Filter images
  const images = displayStatus.media_attachments.filter(m => m.type === 'image')

  return (
    <StatusCardStyle>
      {isReblog && <ReblogBadge>Reblogged</ReblogBadge>}
      {isReply && <ReplyBadge>Reply</ReplyBadge>}
      <StatusContent>
        <StatusMeta>
          <div className="avatar">
            <Image
              src={displayStatus.account.avatar_static}
              alt={displayStatus.account.display_name}
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <div className="meta-text">
            <span className="author">{displayStatus.account.display_name}</span>
            <span className="meta-sm">@{displayStatus.account.username}</span>
            <span className="meta-sm date">{formatTime(displayStatus.created_at)}</span>
          </div>
        </StatusMeta>
        <StatusText>
          <MarkdownStyle
            dangerouslySetInnerHTML={{
              __html: formatContent(displayStatus.content, displayStatus.emojis)
            }}
          />
        </StatusText>
        {images.length > 0 && (
          <ImagesSection>
            <ShowImagesLink onClick={() => onShowImage(images)}>
              [{images.length} image{images.length > 1 ? 's' : ''}]
            </ShowImagesLink>
          </ImagesSection>
        )}
        <StatusFooter>
          <a
            href={displayStatus.url}
            target="_blank"
            rel="noopener noreferrer"
            className="permalink"
          >
            View on Mastodon
          </a>
        </StatusFooter>
      </StatusContent>
    </StatusCardStyle>
  )
}

/** Styles **/
const OneColLayout = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  .button-float {
    display: none;
  }

  @media screen and (max-width: 780px) {
    max-width: 100%;
    .button-float {
      display: unset;
    }
  }

  @media screen and (max-width: 580px) {
  }
`

const Col = styled.div`
  width: 100%;
  padding: 73px 16px 48px 16px;
  align-self: flex-end;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (min-width: 1080px) {
    max-width: 680px;
  }

  @media screen and (max-width: 780px) {
    width: 100%;
  }

  @media screen and (max-width: 580px) {
    padding-left: 0;
    padding-right: 0;
  }
`

const SiderContent = styled.div<{
  $isMobileSider: boolean,
}>`
  position: sticky;
  max-width: 15rem;
  padding-top: 83px;
  padding-bottom: 64px;
  margin: 0 0.5rem;
  height: 100vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  .close-btn {
    display:none;
    z-index: 1;
  }

  @media screen and (max-width: 1080px) {
    margin: 0;
  }

  @media screen and (min-width: 780px) {
    animation: ${fadeInRight} 0.5s ease;
  }

  @media screen and (max-width: 780px){
    ${floatMenu}
    position: fixed;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid ${props => props.theme.colors.uiLineGray2};
    border-bottom: none;
    max-width: unset;
    width: 100%;
    height: min(66vh, 500px);
    padding: 0rem 1rem 1rem 1rem;
    transition: transform .3s ease;
    transform: ${p => p.$isMobileSider ? `translateY(0)` : `translateY(105%)`};

    .close-btn {
      position: sticky;
      top: 0px;
      background: inherit;
      transform: translateY(-1px);
      border-bottom: 1px solid ${props => props.theme.colors.uiLineGray2};

      display: flex;
      font-weight: 600;
      justify-content: space-between;
      align-items: center;

      padding: 1rem 0 0.75rem 0;
      margin-bottom: 1rem;
      ${p => p.$isMobileSider ? null : `visibility:hidden;`}
      color: ${p => p.theme.colors.textGray2};
      font-size: 1rem;
      cursor:pointer;
    }
    .close-btn:hover{
      color: ${p => p.theme.colors.accent};
    }
  }
`

const NavCard = styled.div`
  border-radius: 0.5rem;
  background: ${p => p.theme.colors.bg};
  margin: 0 1rem 1rem 1rem;
  padding: 1rem;
  border: 1px solid ${p => p.theme.colors.uiLineGray2};
  box-shadow: 0 0 12px 0 ${props => props.theme.colors.shadowBg};

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${p => p.theme.colors.textSecondary};
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: ${p => p.theme.colors.textGray};
  }
`

const MastodonColContainer = styled.div`
  margin: 0.625rem 0;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.uiLineGray2};
  background-color: ${props => props.theme.colors.bg};
  box-shadow: 0 0 12px 0 ${props => props.theme.colors.shadowBg};

  & > section:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  & > section:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  & > section:not(:last-child) {
    border-bottom: solid 1px ${props => props.theme.colors.uiLineGray2};
  }
`

const LoadingWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${p => p.theme.colors.textGray3};
  font-weight: bold;
`

const ErrorWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${p => p.theme.colors.accentHover};
  font-weight: bold;
`

const EmptyWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${p => p.theme.colors.textGray3};
  font-weight: bold;
`

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${p => p.theme.colors.bg};
  color: ${p => p.theme.colors.textSecondary};
  border: none;
  border-top: 1px solid ${p => p.theme.colors.uiLineGray2};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: ${p => p.theme.colors.accent};
    background: ${p => p.theme.colors.bg2};
  }
`

const StatusCardStyle = styled.section`
  background: ${p => p.theme.colors.bg};
  padding: 1.25rem 1.5rem;
  animation: ${bottomFadeIn} 0.3s ease;

  @media screen and (max-width: 580px) {
    padding: 1rem;
    border-radius: unset;
  }
`

const ReblogBadge = styled.div`
  padding: 0.5rem 0;
  color: ${p => p.theme.colors.accent};
  font-size: 0.875rem;
  font-weight: 500;
`

const ReplyBadge = styled.div`
  padding: 0.5rem 0;
  color: ${p => p.theme.colors.textGray3};
  font-size: 0.875rem;
`

const StatusContent = styled.div`
  position: relative;
`

const StatusMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
    border: 1px solid ${p => p.theme.colors.uiLineGray};
    position: relative;
    overflow: hidden;
  }

  .avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .meta-text {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .author {
    color: ${p => p.theme.colors.textSecondary};
    font-weight: 600;
  }

  .meta-sm {
    color: ${p => p.theme.colors.textGray};
    font-size: 0.8rem;
  }
`

const StatusText = styled.div`
  padding-left: 48px;
  margin-bottom: 1rem;

  .emoji {
    display: inline;
    height: 1.2em;
    vertical-align: middle;
  }

  a {
    color: ${p => p.theme.colors.accent};
    text-decoration: none;

    &:hover {
      color: ${p => p.theme.colors.accentHover};
      text-decoration: underline;
    }
  }

  p, ul, ol {
    line-height: 1.625rem;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
`

const ImagesSection = styled.div`
  padding-left: 48px;
  margin-bottom: 1rem;
`

const ShowImagesLink = styled.span`
  color: ${p => p.theme.colors.accent};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    color: ${p => p.theme.colors.accentHover};
    text-decoration: underline;
  }
`

const StatusFooter = styled.div`
  padding-left: 48px;
  padding-top: 0.5rem;
  border-top: 1px solid ${p => p.theme.colors.uiLineGray2};

  .permalink {
    color: ${p => p.theme.colors.textGray};
    font-size: 0.8rem;
    text-decoration: none;

    &:hover {
      color: ${p => p.theme.colors.accent};
    }
  }
`

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  max-width: 780px;
  margin: 0 auto;
  background: ${p => p.theme.colors.bg};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${dropShadow}

  @media screen and (min-width: 780px) {
    height: 96vh;
    margin-top: 2vh;
    border-radius: 0.5rem;
  }
`

const ImageWrapper = styled.div`
  a {
    display: block;
    text-decoration: none;

    img {
      max-width: 100%;
      height: auto !important;
      border-radius: 0.5rem;
    }
  }
`

const CommentContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  max-width: 780px;
  margin: 0 auto;
  background: ${p => p.theme.colors.bg};

  padding-top: 2rem;
  padding-bottom: 2rem;

  ${dropShadow}

  & > div {
    max-width: min(90%, 780px);
    cursor: default;
  }

  @media screen and (min-width: 780px) {
    height: 96vh;
    margin-top: 2vh;
    border-radius: 0.5rem;
  }
`

const RefreshButton = styled.button`
  padding: 0.25em 0.5em;
  border: none;
  border-radius: 0.25rem;
  background: none;
  color: ${p => p.theme.colors.textGray2};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${p => p.theme.colors.bg2};
    color: ${p => p.theme.colors.accent};
  }
`

const FriendLink = styled(LinkWithLine)`
  display: block;
  padding: 0.3em 0;
`

const MoreLink = styled(LinkWithLine)`
  display: block;
  padding: 0.3em 0;
  color: ${p => p.theme.colors.accent};
`

const ImageModal = styled(Modal)`
  .modal-content {
    max-width: 90vw;
  }
`
