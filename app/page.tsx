import {
  AnimatedImg,
  AnimatedWrapper,
} from "@/components/framer-motion/animated";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 bg-home font-customFont">
      <section>
        <motion.p
          style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          className="text-5xl py-5"
        >
          Eventia
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0 }}
          className=" py-10"
        >
          <p>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis potenti
            libero vehicula mattis ornare mus magna curabitur. Commodo montes
            sodales commodo ornare lobortis. Per nunc hendrerit quam varius
            metus. Eget in nam aenean, aenean dictum phasellus morbi! Ante ut
            risus lobortis faucibus turpis congue vulputate purus. Suscipit
            lobortis senectus id pharetra dignissim semper eros sem vehicula.
          </p>
          <p>
            Aenean praesent cursus morbi lacinia velit montes est sed potenti.
            Aenean purus mi fames dolor sit. Diam elementum aenean euismod
            ultrices rhoncus nullam! Felis a tristique habitant porta natoque
            nostra. Aptent placerat sapien fringilla egestas suspendisse
            penatibus at per. Nisi sem scelerisque nulla suscipit fusce
            habitasse! Enim condimentum platea id nam suspendisse nisl, eleifend
            mauris taciti.
          </p>
        </motion.div>
      </section>

      <div className="flex flex-wrap py-5" style={{ width: "100%" }}>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-2/5 xl:w-2/5 mb-2">
          <AnimatedImg className="flex justify-center items-center h-full rounded-2xl">
            <img
              src="https://placehold.co/200x200.png"
              alt="image"
              className="rounded-full"
            />
          </AnimatedImg>
        </div>
        <div className="w-full sm:w-1/2 md:w-2/3 lg:w-3/5 xl:w-3/5 mb-2">
          <div className="flex justify-center items-center h-full">
            <AnimatedWrapper text="Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis potenti libero vehicula mattis ornare mus magna curabitur. Commodo montes sodales commodo ornare lobortis. Per nunc hendrerit quam varius metus. Eget in nam aenean, aenean dictum phasellus morbi! Ante ut risus lobortis faucibus turpis congue vulputate purus. Suscipit lobortis senectus id pharetra dignissim semper eros sem vehicula." />
          </div>
        </div>
      </div>
      <div
        className="flex md:flex-row-reverse flex-wrap py-5"
        style={{ width: "100%" }}
      >
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-2/5 xl:w-2/5 mb-2">
          <AnimatedImg className="flex justify-center items-center h-full rounded-2xl">
            <img
              src="https://placehold.co/200x200.png"
              alt="image"
              className="rounded-full"
            />
          </AnimatedImg>
        </div>
        <div className="w-full sm:w-1/2 md:w-2/3 lg:w-3/5 xl:w-3/5 mb-2">
          <div className="flex justify-center items-center h-full">
            <AnimatedWrapper text="Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis potenti libero vehicula mattis ornare mus magna curabitur. Commodo montes sodales commodo ornare lobortis. Per nunc hendrerit quam varius metus. Eget in nam aenean, aenean dictum phasellus morbi! Ante ut risus lobortis faucibus turpis congue vulputate purus. Suscipit lobortis senectus id pharetra dignissim semper eros sem vehicula." />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap py-5" style={{ width: "100%" }}>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-2/5 xl:w-2/5 mb-2">
          <AnimatedImg className="flex justify-center items-center h-full rounded-2xl">
            <img
              src="https://placehold.co/200x200.png"
              alt="image"
              className="rounded-full"
            />
          </AnimatedImg>
        </div>
        <div className="w-full sm:w-1/2 md:w-2/3 lg:w-3/5 xl:w-3/5 mb-2">
          <div className="flex justify-center items-center h-full">
            <AnimatedWrapper text="Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis potenti libero vehicula mattis ornare mus magna curabitur. Commodo montes sodales commodo ornare lobortis. Per nunc hendrerit quam varius metus. Eget in nam aenean, aenean dictum phasellus morbi! Ante ut risus lobortis faucibus turpis congue vulputate purus. Suscipit lobortis senectus id pharetra dignissim semper eros sem vehicula." />
          </div>
        </div>
      </div>
    </main>
  );
}
