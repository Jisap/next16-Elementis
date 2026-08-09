import cn from "@/utils/cn";
import * as motion from "motion/react-client";
import { HTMLMotionProps } from "motion/react";
import React from "react";

type DashedLinkProps = Omit<HTMLMotionProps<"div">, "children"> & {
    children?: React.ReactNode;
};

// export default function DashedLink({
//   children,
//   className,
//   style,
//   ...animationProps
// }: DashedLinkProps) {
//   return (
//     <motion.div className="" {...animationProps}>
//       <motion.div
//         initial="initial"
//         whileHover="hover"
//         className={cn("relative leading-[1.2]", className)}
//         style={{ ...style }}
//       >
//         {children}
//         <motion.div
//           className="animated-underline absolute bottom-0 h-px bg-black"
//           variants={{
//             initial: { width: "0%", right: "0px", left: "auto" },
//             hover: { width: "100%", left: "0px", right: "auto" },
//           }}
//           transition={{
//             left: {
//               duration: 0,
//             },
//             right: {
//               duration: 0,
//             },
//             default: {
//               ease: [0.24, 0.43, 0.15, 0.97],
//               duration: 0.8,
//             },
//           }}
//         />
//       </motion.div>
//     </motion.div>
//   );
// }

export default function DashedLink({
    children,
    className,
    ...props
}: DashedLinkProps) {
    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className={cn("relative leading-[1.2] w-fit", className)}
            {...props}
        >
            {children}
            <motion.div
                className="animated-underline absolute bottom-0 left-0 h-px w-full bg-black origin-right"
                variants={{
                    initial: { scaleX: 0 },
                    hover: { scaleX: 1, originX: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.24, 0.43, 0.15, 0.97] }}
            />
        </motion.div>
    );
}