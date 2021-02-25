import React, { Suspense } from "react";
import type { DataFetchMDb, DataFetchSpotify } from "../../config/useDataFetch";
import useDataFetch from "../../config/useDataFetch";
import type { MediaSelected } from "../../types/typesMedia";
import MdSpinner from "../md/MdSpinner";
import InfoMDb from "./InfoMDb";
import InfoSpotify from "./InfoSpotify";

interface Props {
  selected: MediaSelected;
}
function InfoBody({ selected }: Props): JSX.Element {
  return (
    <Suspense fallback={<MdSpinner />}>
      <InfoSuspense selected={selected} />
    </Suspense>
  );
}

function InfoSuspense({ selected }: Props) {
  const { type, artistId, mediaId, season } = selected;
  const { data, error, isLoading } = useDataFetch({
    type,
    isSuspense: true,
    firstId: mediaId,
    secondId: artistId,
    season,
  });

  if (error) {
    return <div>something happened</div>;
  }

  if (data && !isLoading) {
    return type === "album" ? (
      <InfoSpotify
        artistInfo={(data as DataFetchSpotify)[1]}
        albumInfo={(data as DataFetchSpotify)[0]}
      />
    ) : (
      <InfoMDb type={type} data={data as DataFetchMDb} />
    );
  }
  return null;
}

export default InfoBody;
