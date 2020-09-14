import {
  Collapse,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { EditIcon, EmailIcon, StarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { ContextState } from "../../config/store";
import useUser from "../../utils/useUser";
import StarEmptyIcon from "../../components/Icons/StartEmptyIcon";
import Info from "../../components/Info";
import { createMediaState } from "../../utils/helpers";
import { useCollection } from "@nandorojo/swr-firestore";

function DiaryItem() {
  return <div>nothing</div>;
  // return <Day />;
  // const { edit } = useContext(ContextState);
  // const router = useRouter();
  // const dispatch = useContext(ContextDispatch);
  // const { user } = useUser();
  // const { user, logout } = useUser();
  // const { isOpen, onToggle } = useDisclosure();
  // const router = useRouter();
  // const { data } = useCollection(user.email);

  // console.log(router.pathname, router.query);
  // if (data) {
  //   const { diaryState, mediaState } = createMediaState(data);

  //   if (
  //     Object.keys(diaryState).length > 0 &&
  //     Object.keys(mediaState).length > 0 &&
  //     !!router.query.item
  //   ) {
  //     return <div>asd</div>;
  //     // const { info, item } = edit;
  //     // const { rating, diaryDate } = item;
  //     // const { overview } = info;
  //     // return (
  //     //   <Modal
  //     //     isOpen={true}
  //     //     onClose={() => router.push("/")}
  //     //     scrollBehavior="inside"
  //     //     size="sm"
  //     //     trapFocus={false}
  //     //   >
  //     //     <ModalOverlay px={4}>
  //     //       <ModalContent>
  //     //         <ModalCloseButton />
  //     //         <ModalBody pt={6}>
  //     //           <Info item={info} />
  //     //           <HStack spacing={2} justify="center" mt={2}>
  //     //             {overview && (
  //     //               <>
  //     //                 <IconButton
  //     //                   variant="outline"
  //     //                   colorScheme="blue"
  //     //                   aria-label="Show Overview"
  //     //                   size="sm"
  //     //                   icon={<EmailIcon />}
  //     //                   onClick={onToggle}
  //     //                   isRound
  //     //                 />
  //     //               </>
  //     //             )}
  //     //             <IconButton
  //     //               icon={<EditIcon />}
  //     //               aria-label="edit"
  //     //               variant="outline"
  //     //               size="sm"
  //     //               colorScheme="green"
  //     //               isRound
  //     //             />
  //     //           </HStack>
  //     //           <Divider mt={3} mb={2} />
  //     //           <Flex justifyContent="space-between">
  //     //             <Stat>
  //     //               <StatNumber>
  //     //                 {dayjs(diaryDate.toDate()).format("MMM D, YYYY")}
  //     //               </StatNumber>
  //     //               <StatHelpText>Date</StatHelpText>
  //     //             </Stat>
  //     //             <Stat>
  //     //               <StatNumber>
  //     //                 <Rating
  //     //                   fractions={2}
  //     //                   readonly
  //     //                   initialRating={rating}
  //     //                   fullSymbol={<StarIcon color="purple.400" />}
  //     //                   emptySymbol={<StarEmptyIcon stroke="purple.400" />}
  //     //                 />
  //     //               </StatNumber>
  //     //               <StatHelpText textAlign="right">Rating</StatHelpText>
  //     //             </Stat>
  //     //           </Flex>
  //     //           <Collapse isOpen={isOpen}>
  //     //             <Text fontSize="sm" mb={4}>
  //     //               {overview}
  //     //             </Text>
  //     //           </Collapse>
  //     //         </ModalBody>
  //     //       </ModalContent>
  //     //     </ModalOverlay>
  //     //   </Modal>
  //     // );
  //   }
  // }

  // // if (typeof edit !== "undefined") {
  // //   const { info, item } = edit;
  // //   const { rating, diaryDate } = item;
  // //   const { overview } = info;
  // //   return (
  // //     <Modal
  // //       isOpen={true}
  // //       onClose={() => router.push("/")}
  // //       scrollBehavior="inside"
  // //       size="sm"
  // //       trapFocus={false}
  // //     >
  // //       <ModalOverlay px={4}>
  // //         <ModalContent>
  // //           <ModalCloseButton />
  // //           <ModalBody pt={6}>
  // //             <Info item={info} />
  // //             <HStack spacing={2} justify="center" mt={2}>
  // //               {overview && (
  // //                 <>
  // //                   <IconButton
  // //                     variant="outline"
  // //                     colorScheme="blue"
  // //                     aria-label="Show Overview"
  // //                     size="sm"
  // //                     icon={<EmailIcon />}
  // //                     onClick={onToggle}
  // //                     isRound
  // //                   />
  // //                 </>
  // //               )}
  // //               <IconButton
  // //                 icon={<EditIcon />}
  // //                 aria-label="edit"
  // //                 variant="outline"
  // //                 size="sm"
  // //                 colorScheme="green"
  // //                 isRound
  // //               />
  // //             </HStack>
  // //             <Divider mt={3} mb={2} />
  // //             <Flex justifyContent="space-between">
  // //               <Stat>
  // //                 <StatNumber>
  // //                   {dayjs(diaryDate.toDate()).format("MMM D, YYYY")}
  // //                 </StatNumber>
  // //                 <StatHelpText>Date</StatHelpText>
  // //               </Stat>
  // //               <Stat>
  // //                 <StatNumber>
  // //                   <Rating
  // //                     fractions={2}
  // //                     readonly
  // //                     initialRating={rating}
  // //                     fullSymbol={<StarIcon color="purple.400" />}
  // //                     emptySymbol={<StarEmptyIcon stroke="purple.400" />}
  // //                   />
  // //                 </StatNumber>
  // //                 <StatHelpText textAlign="right">Rating</StatHelpText>
  // //               </Stat>
  // //             </Flex>
  // //             <Collapse isOpen={isOpen}>
  // //               <Text fontSize="sm" mb={4}>
  // //                 {overview}
  // //               </Text>
  // //             </Collapse>
  // //           </ModalBody>
  // //         </ModalContent>
  // //       </ModalOverlay>
  // //     </Modal>
  // //   );
  // // }

  // return <div>nothing to show</div>;
}
export default DiaryItem;
