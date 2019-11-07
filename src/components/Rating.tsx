import * as React from "react";
import { useState, useCallback } from "react";
import styled from "styled-components";

interface StarProps {
  index: number;
}
const Star = ({ index }: StarProps) => {
  return <div>star</div>;
};

interface RatingProps {
  value: number | 0;
  onChange: () => void;
}

const Rating = ({ value, onChange }: RatingProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <span>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => (
        <Star index={i} />
      ))}
    </span>
  );
};

export default Rating;

// https://codesandbox.io/s/xpl2wjpyoq

// import * as React from "react";
// import { useState, useCallback } from "react";
// import styled from "styled-components";

// const RatingStart = styled.svg<{ index: number }>`
//   display: inline-block;
//   width: 20px;
//   overflow: hidden;
//   direction: ${props => (props.index && props.index % 2 === 0 ? "ltr" : "rtl")};
// `;

// type StarProps = {
//   index: number;
//   rate: RatingProps["stars"];
//   setRate: React.Dispatch<React.SetStateAction<RatingProps["stars"]>>;
// };

// const Star = ({ rate, setRate, index }: StarProps) => {
//   const {star, tempStar} = rate;

//   // if (this.state.rating >= i && this.state.rating !== null) {
//   //   klass = "ion-ios-star";
//   // }

//   return (
// <RatingStart
// index=
//   xmlns="http://www.w3.org/2000/svg"
//   width="24"
//   height="24"
//   viewBox="0 0 24 24"
//   fill="none"
//   stroke={full ? "blue" : "yellow"}
//   strokeWidth="2"
//   strokeLinecap="round"
//   strokeLinejoin="round"
//   onMouseEnter={handleMouseEnter}
//   onMouseLeave={handleMouseLeave}
// >
//   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
// </RatingStart>
//   );
// };

// type RatingProps = {
//   stars: {
//     star: number | null;
//     tempStar: number | null;
//   };
// };
// const Rating = ({ stars }: RatingProps) => {
//   const [starRating, setStarRating] = useState(stars || null);
//   return (
//     <span>
//       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => (
//         <Star key={i} index={i} rate={starRating} setRate={setStarRating} />
//       ))}
//     </span>
//   );
// };

// export default Rating;

// import * as React from "react";
// import { useState, useCallback } from "react";
// import styled from "styled-components";

// const RatingStart = styled.svg<{ index: number }>`
//   display: inline-block;
//   width: 20px;
//   overflow: hidden;
//   direction: ${props => (props.index && props.index % 2 === 0 ? "ltr" : "rtl")};
// `;

// type StarProps = {
//   index: number;
//   full: boolean;
//   setOverride: (rating: number | null) => void;
// };

// const Star = ({ index, full, setOverride }: StarProps) => {
//   const handleMouseEnter = useCallback(() => setOverride(index), [
//     index,
//     setOverride
//   ]);
//   const handleMouseLeave = useCallback(() => setOverride(null), [setOverride]);
// return (
//   <RatingStart
//     index={index}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={full ? "blue" : "yellow"}
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     onMouseEnter={handleMouseEnter}
//     onMouseLeave={handleMouseLeave}
//   >
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
//   </RatingStart>
// );
// };

// type RatingProps = {
//   rating: number | null;
//   onChange: (rating: number) => void;
// };

// const Rating = ({ rating }: RatingProps) => {
//   const [override, setOverride] = useState<number | null>(null);
//   return (
// <span>
//   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => (
//     <Star
//       key={i}
//       full={i <= (override || rating || 0)}
//       setOverride={setOverride}
//       index={i}
//     />
//   ))}
// </span>
//   );
// };

// export default Rating;
