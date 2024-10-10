"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.03,
        zIndex: 1,
        boxShadow: "0px 0px 0px rgba(0,0,0,1)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

interface CardContent {
  title: string;
  description: string;
}

const cardContents: CardContent[] = [
  {
    title:
      '"I <span class="text-secondary italic">know</span> that I read something about that, but I have no idea <span class="text-secondary italic">where</span>."',
    description:
      'Unearthed will help you find it with its <span class="text-secondary font-semibold">global search</span> giving you the book, author, page number, and any notes you took on it.',
  },
  {
    title: '"I need <span class="text-secondary italic">inspiration</span>"',
    description:
      'Unearthed will serve you a <span class="text-secondary font-semibold">Daily Reflection</span>, via the browser extension, web app, Capacities, and the mobile app (soon).<br /><br />This is not some random quote from the web, this is something that you have <span class="text-secondary font-semibold">enjoyed</span> in the past enough to highlight and maybe even make a note about.',
  },
  {
    title:
      '"I love that book, but it was so <span class="text-secondary italic">overwhelming</span>. I couldn\'t take it all in!"',
    description:
      'Unearthed will serve you <span class="text-secondary font-semibold">daily reflections</span> to help you digest every part of what you read.',
  },
  {
    title:
      '"I\'m <span class="text-secondary italic">sick</span> of manually downloading and backing up my kindle highlights"',
    description:
      'Unearthed will <span class="text-secondary font-semibold">automatically</span> download and sync your data for you.',
  },
  {
    title:
      '"My notes are <span class="text-secondary italic">all over</span> the place"',
    description:
      'Unearthed can act as a <span class="text-secondary font-semibold">bridge</span> to get your quotes and notes to whatever note taking app you use.',
  },
];

export const AnimatedCards = () => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 33 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
      },
    },
  };
  return (
    <div className="my-12 w-full flex flex-wrap items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="md:grid grid-cols-3 grid-rows-6 gap-4 max-w-[900px]"
      >
        {cardContents.map((content, index) => (
          <MotionCard
            key={index}
            variants={itemVariants}
            className={`mt-4 md:mt-0 ${
              index === 0
                ? "row-span-3"
                : index === 1
                ? "col-span-2 row-span-3"
                : `col-span-1 row-span-3 ${index >= 2 ? "row-start-4" : ""} ${
                    index === 4 ? "col-start-3" : ""
                  }`
            }`}
          >
            <div className="w-full h-full p-4 border-2 border-black rounded-lg bg-card transition-all duration-200 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <h3
                className={`${crimsonPro.className} font-extrabold text-3xl`}
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
              <p
                className="text-xs md:text-base mt-2"
                dangerouslySetInnerHTML={{ __html: content.description }}
              />
            </div>
          </MotionCard>
        ))}
      </motion.div>
    </div>
  );
};
