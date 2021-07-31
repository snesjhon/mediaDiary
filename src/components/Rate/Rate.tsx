import { useDataFetch } from "@/config";
import { useFuegoUser } from "@/fuego";
import type { MDbMovie, MediaDiaryWithId } from "@/types";
import { DrawerBody } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import type { MoviePopularResult } from "../Add/hooks/useMediaTopFetch/types";
import { ContentDrawer } from "../Content/components";
import { MediaMovie } from "../Media";
import { fuegoDiaryById } from "../Selected/config";

interface Props {
  movieResult: MoviePopularResult;
}

/** For our rate component we want to  */
export default function Rate({ movieResult }: Props): JSX.Element {
  const { user } = useFuegoUser();
  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && movieResult
      ? ["/fuego/rateById", user.uid, "movie", movieResult.id.toString()]
      : null,
    fuegoDiaryById,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: movieData, isLoading } = useDataFetch(
    movieResult
      ? { firstId: movieResult.id.toString(), type: "movie" }
      : { firstId: false, type: "movie" }
  );
  if (isValidating) return <div>loading</div>;

  return (
    <ContentDrawer isOpen={true} placement="right">
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {movieData && <MediaMovie data={movieData as MDbMovie} />}
      </DrawerBody>
    </ContentDrawer>
  );

  // if (!data) return <div>newMovie {movieResult.title}</div>;

  // return <div>{data.title}</div>;
}
