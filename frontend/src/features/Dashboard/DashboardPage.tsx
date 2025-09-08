import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  BiMusic,
  BiUser,
  BiDisc,
  BiRightArrowAlt,
  BiCategory, // A more generic icon for genres
} from "react-icons/bi";
import { BsCollectionPlay } from "react-icons/bs";
import { Loader, Button } from "../../ui"; // Assuming Loader and Button are available
import RootState from "../../redux/RootState";
import { fetchStatisticsStart } from "../../redux/slices/statisticsSlice";

// --- Global Dashboard Container ---
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; /* Increased overall spacing between sections */
  padding: 1rem; /* Add some padding around the whole dashboard */
`;

// --- Hero Section Styling ---
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(220px, 1fr)
  ); /* Flexible grid for hero stats */
  gap: 1.5rem;
  background: var(--second-background-color); /* Gradient background */
  padding: 2.5rem;
  border-radius: var(--radius-xl, 16px);
  box-shadow: var(--shadow-2xl, 0 15px 30px rgba(0, 0, 0, 0.4));
  color: var(
    --primary-color-text,
    #ffffff
  ); /* Text color contrasting with primary */
  position: relative;
  overflow: hidden; /* For any potential background patterns */

  /* Subtle background pattern */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 10% 20%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 70%
      ),
      radial-gradient(
        circle at 90% 80%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 70%
      );
    opacity: 0.8;
    z-index: 0;
  }
`;

const HeroStatCard = styled.div`
  background-color: var(
    --background-color
  ); /* Slightly transparent background */
  border-radius: var(--radius-lg, 12px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px); /* Frosted glass effect */
  position: relative; /* For z-index of content */
  z-index: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const HeroStatIcon = styled.div`
  font-size: 2.8rem; /* Larger icons */
  margin-bottom: 0.75rem;
  color: var(--text-color, #ffffff); /* Icons match text */
  opacity: 0.9;
`;

const HeroStatValue = styled.div`
  font-size: 2.8rem; /* Prominent value */
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  line-height: 1;
`;

const HeroStatLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color, #ffffff);
  opacity: 0.8;
`;

// --- General Section Styling ---
const ContentSection = styled.section`
  background-color: var(--second-background-color);
  border-radius: var(--radius-xl, 16px);
  padding: 2rem;
  border: 1px solid var(--border-color, #383838);
  box-shadow: var(--shadow-md, 0 4px 10px rgba(0, 0, 0, 0.2));
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Gap for inner items */
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color-light, #424242);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-color);
  font-size: 1.8rem; /* Larger section titles */
  font-weight: 600;
  margin: 0;
`;

const ShowAllButton = styled(Button)`
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md, 8px);
  color: var(--text-color); /* Ghost variant text color */
  background: transparent;
  border: 1px solid transparent;

  &:hover {
    background-color: var(--nav-item-hover-bg, #3a3a3a);
    color: var(--text-color);
    border-color: var(--border-color-light, #424242);
  }

  svg {
    transition: transform 0.2s ease-in-out;
  }
  &:hover svg {
    transform: translateX(3px);
  }
`;

// --- Chart/List Item Styling ---
const ChartList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0; /* More padding */
  border-bottom: 1px dashed var(--border-color-light, #424242); /* Dashed border for visual interest */
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background-color: var(--second-background-color, #3a3a3a);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--background-color, #3a3a3a);
    border-radius: var(--radius-sm, 6px);
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
`;

const ChartItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ChartLabel = styled.div`
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
`;

const ChartSubLabel = styled.div`
  color: var(--text-color-secondary);
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const ChartValue = styled.div`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  white-space: nowrap; /* Prevent wrapping */
  margin-left: 1rem; /* Space from label */
`;

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { statistics, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  useEffect(() => {
    dispatch(fetchStatisticsStart());
  }, [dispatch]);

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <p style={{ color: "var(--red-primary)" }}>Error: {error}</p>
      </DashboardContainer>
    );
  }

  if (!statistics) {
    return (
      <DashboardContainer>
        <p style={{ color: "var(--text-color-secondary)" }}>
          No statistics available. Please add some data!
        </p>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* --- Hero Section: Overview Stats --- */}
      <HeroSection>
        <HeroStatCard onClick={() => navigate("/songs")}>
          <HeroStatIcon>
            <BiMusic />
          </HeroStatIcon>
          <HeroStatValue>{statistics.totals.songs}</HeroStatValue>
          <HeroStatLabel>Total Songs</HeroStatLabel>
        </HeroStatCard>

        <HeroStatCard onClick={() => navigate("/songs")}>
          <HeroStatIcon>
            <BiUser />
          </HeroStatIcon>
          <HeroStatValue>{statistics.totals.artists}</HeroStatValue>
          <HeroStatLabel>Unique Artists</HeroStatLabel>
        </HeroStatCard>

        <HeroStatCard onClick={() => navigate("/songs")}>
          <HeroStatIcon>
            <BiDisc />
          </HeroStatIcon>
          <HeroStatValue>{statistics.totals.albums}</HeroStatValue>
          <HeroStatLabel>Total Albums</HeroStatLabel>
        </HeroStatCard>

        <HeroStatCard onClick={() => navigate("/songs")}>
          <HeroStatIcon>
            <BiCategory /> {/* Using BiCategory for genres */}
          </HeroStatIcon>
          <HeroStatValue>{statistics.totals.genres}</HeroStatValue>
          <HeroStatLabel>Distinct Genres</HeroStatLabel>
        </HeroStatCard>
      </HeroSection>

      {/* --- Section: Songs by Genre --- */}
      <ContentSection>
        <SectionHeader>
          <SectionTitle>Songs by Genre</SectionTitle>
          <ShowAllButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/songs?filter=genre")} // Example navigation
          >
            Explore Genres <BiRightArrowAlt />
          </ShowAllButton>
        </SectionHeader>
        <ChartList>
          {statistics.songsByGenre.length === 0 ? (
            <ChartItem>
              <ChartItemContent>
                <ChartLabel>No genre data available</ChartLabel>
              </ChartItemContent>
              <ChartValue>-</ChartValue>
            </ChartItem>
          ) : (
            statistics.songsByGenre.slice(0, 5).map((item, index) => (
              <ChartItem
                key={index}
                onClick={() => navigate(`/songs?genre=${item.genre}`)} // Example navigation
              >
                <ChartItemContent>
                  <ChartLabel>{item.genre}</ChartLabel>
                </ChartItemContent>
                <ChartValue>{item.count} songs</ChartValue>
              </ChartItem>
            ))
          )}
        </ChartList>
      </ContentSection>

      {/* --- Section: Top Artists --- */}
      <ContentSection>
        <SectionHeader>
          <SectionTitle>Top Artists</SectionTitle>
          <ShowAllButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/songs?filter=artist")} // Example navigation
          >
            View All Artists <BiRightArrowAlt />
          </ShowAllButton>
        </SectionHeader>
        <ChartList>
          {statistics.songsByArtist.length === 0 ? (
            <ChartItem>
              <ChartItemContent>
                <ChartLabel>No artist data available</ChartLabel>
              </ChartItemContent>
              <ChartValue>-</ChartValue>
            </ChartItem>
          ) : (
            statistics.songsByArtist.slice(0, 5).map((item, index) => (
              <ChartItem
                key={index}
                onClick={() => navigate(`/songs?artist=${item.artist}`)} // Example navigation
              >
                <ChartItemContent>
                  <ChartLabel>{item.artist}</ChartLabel>
                  <ChartSubLabel>
                    {item.songCount} songs, {item.albumCount} albums
                  </ChartSubLabel>
                </ChartItemContent>
                <ChartValue>{item.songCount}</ChartValue>
              </ChartItem>
            ))
          )}
        </ChartList>
      </ContentSection>

      {/* --- Section: Top Albums --- */}
      <ContentSection>
        <SectionHeader>
          <SectionTitle>Top Albums</SectionTitle>
          <ShowAllButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/songs?filter=album")} // Example navigation
          >
            Discover Albums <BiRightArrowAlt />
          </ShowAllButton>
        </SectionHeader>
        <ChartList>
          {statistics.songsByAlbum.length === 0 ? (
            <ChartItem>
              <ChartItemContent>
                <ChartLabel>No album data available</ChartLabel>
              </ChartItemContent>
              <ChartValue>-</ChartValue>
            </ChartItem>
          ) : (
            statistics.songsByAlbum.slice(0, 5).map((item, index) => (
              <ChartItem
                key={index}
                onClick={() => navigate(`/songs?album=${item.album}`)} // Example navigation
              >
                <ChartItemContent>
                  <ChartLabel>{item.album}</ChartLabel>
                  <ChartSubLabel>{item.artist}</ChartSubLabel>
                </ChartItemContent>
                <ChartValue>{item.songCount} songs</ChartValue>
              </ChartItem>
            ))
          )}
        </ChartList>
      </ContentSection>
    </DashboardContainer>
  );
};

export default DashboardPage;
