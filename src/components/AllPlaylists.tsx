import { useAppSelector } from "../redux/hooks";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";

export default function AllPlaylists() {
  const [isDesktop, setIsDesktop] = useState(false);

  // Implementation of dynamic nav bar.
  // Code is dependent upon window.matchMedia function, recommended by this post.
  // See: 'Using JavaScript'.
  // Source: https://stackoverflow.com/questions/50156069/how-can-i-make-my-existing-responsive-navigation-bar-into-a-hamburger-menu-for-s
  // Tablet
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 720px)");
    const handleScreenChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    screen.addEventListener("change", handleScreenChange);
    setIsDesktop(screen.matches);

    return () => {
      screen.removeEventListener("change", handleScreenChange);
    };
  }, []);

  const userPlaylists = useAppSelector((state) => state.playlists);
  const status = useAppSelector((state) => state.playlists.loading);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error with retrieving playlists</div>;
  if (userPlaylists.playlistsOverview?.items.length === 0) {
    return <h1>You don't have any playlists</h1>;
  }

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    @media (min-width: 720px) {
      flex-direction: row;
      flex-wrap: wrap;
      margin-left: 5rem;
    }
  `;

  const Cards = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    align-items: center;
    box-shadow: 0 0 10px 0 gray;
    border-radius: 15px;
    width: 310px;
    padding: 5px;

    @media (min-width: 720px) {
      flex-direction: column;
      margin-right: 1rem;
      padding-top: 8px;
    }

    @media (max-width: 719px) {
      width: 98%;
    }
  `;

  const VideoInfo = styled.div`
    width: 100%;
    flex-direction: column;
    padding-left: 1rem;

    p,
    h3 {
      margin: 0px;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  `;

  const Thumbnail = styled.img`
    border-radius: 15px;

    @media (min-width: 720px) {
      width: 300px;
      height: 225px;
    }

    @media (max-width: 719px) {
      width: 150px;
    }
  `;

  return (
    <>
      <Container>
        {userPlaylists.playlistsOverview?.items.map((playlist) => (
          <Cards key={playlist.id}>
            {isDesktop ? (
              <Thumbnail
                src={playlist.snippet.thumbnails.high.url}
                alt="thumbnail"
              />
            ) : (
              <Thumbnail
                src={playlist.snippet.thumbnails.default.url}
                alt="thumbnail"
              />
            )}

            <VideoInfo>
              <h3>{playlist.snippet.title}</h3>
              <p>
                {playlist.contentDetails.itemCount}{" "}
                {playlist.contentDetails.itemCount === 1 ? "video" : "videos"}
              </p>
              {/* <p>{playlist.snippet.description}</p> */}
            </VideoInfo>
          </Cards>
        ))}
      </Container>
    </>
  );
}
