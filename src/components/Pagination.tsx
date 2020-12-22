import { Button, Center, HStack } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { useMDDispatch } from "../config/store";

function Pagination({ userUid }: { userUid: string }): JSX.Element {
  return <div>working on it</div>;
  // const { data, error } = useSWR(
  //   ["/fuego/diaryCount", userUid],
  //   fuegoDiaryCount,
  //   {
  //     revalidateOnFocus: false,
  //   }
  // );
  // const dispatch = useMDDispatch();
  // if (data) {
  //   return (
  //     <Center py={4}>
  //       <HStack spacing="24px">
  //         {new Array(Math.ceil(data / 30)).fill(null).map((_, i) => (
  //           <Button
  //             key={`pagination_${i}`}
  //             onClick={() => {
  //               dispatch({
  //                 type: "state",
  //                 payload: {
  //                   key: "page",
  //                   value: i + 1,
  //                 },
  //               });
  //               return window.scrollTo({ top: 0 });
  //             }}
  //           >
  //             {i + 1}
  //           </Button>
  //         ))}
  //       </HStack>
  //     </Center>
  //   );
  // } else {
  //   return <div>loading</div>;
  // }
}
export default Pagination;
