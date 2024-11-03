import * as motion from "framer-motion/client";
import { AnimatedImgProps, AnimatedWrapperProps } from "@/types/framer-motion";

function AnimatedImg({ children, className }: AnimatedImgProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: 0.8 }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1, transition: { duration: 2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedWrapper({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedWrapperProps) {
  const defaultAnimations = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
  return (
    <Wrapper className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          className="inline-block"
          variants={defaultAnimations}
          initial="hidden"
          viewport={{ once: true, amount: 0.8 }}
          whileInView="visible"
          transition={{ delay: 0.02 * i }}
        >
          {word}
          <span>&nbsp;</span>
        </motion.span>
      ))}
    </Wrapper>
  );
}

export { AnimatedImg, AnimatedWrapper };
