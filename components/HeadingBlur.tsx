export const HeadingBlur = ({
  content,
}: {
  content: string;
}) => {
  return (
    <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 text-alternate shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
      <h3 className="font-bold text-xs">{content}</h3>
    </div>
  );
};
