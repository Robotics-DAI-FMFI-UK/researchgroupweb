// import React, { useState } from "react";
// import { SizeMe } from "react-sizeme";
//
// // https://codesandbox.io/s/13m9vq68pl?file=/src/use-sizeme.js:0-532
// export const useSizeMe = (children, options) => {
//   const [currentSize, setSize] = useState({ width: null, height: null });
//   return [
//     <SizeMe monitorHeight>
//       {({ size }) => {
//         if (
//           size.width !== currentSize.width ||
//           size.height !== currentSize.height
//         ) {
//           setSize(size);
//         }
//         return { children };
//       }}
//     </SizeMe>,
//     currentSize.width,
//     currentSize.height,
//   ];
// };
