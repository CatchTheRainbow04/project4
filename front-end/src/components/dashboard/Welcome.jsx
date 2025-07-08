import React from "react";
import SplitText from "../../../Reactbits/SplitText/SplitText";

export default function Welcome() {
  return (
    <div>
      <SplitText
        text="Welcome to dashboard , sir ~~~"
        className="text-4xl md:text-5xl font-bold"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />
    </div>
  );
}
